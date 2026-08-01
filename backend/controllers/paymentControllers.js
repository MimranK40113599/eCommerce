import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Stripe from "stripe";
import ErrorHandler from "../utils/errorHandler.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;

    if (!body || !body.orderItems || body.orderItems.length === 0) {
      return next(new ErrorHandler("No order items provided", 400));
    }

    if (!body.shippingInfo || !body.shippingInfo.address) {
      return next(new ErrorHandler("Shipping information is required", 400));
    }

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: Math.round(item?.price * 100), // Ensure integer
        },
        tax_rates: [process.env.STRIPE_TAX_RATE_ID],
        quantity: item?.quantity,
      };
    });

    const shippingInfo = body?.shippingInfo;

    // Use environment variables for shipping rates
    const shipping_rate =
      body?.itemsPrice >= 200
        ? process.env.STRIPE_FREE_SHIPPING_RATE_ID
        : process.env.STRIPE_STANDARD_SHIPPING_RATE_ID;

    if (!shipping_rate) {
      return next(new ErrorHandler("Shipping rate configuration error", 500));
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        customer_email: req?.user?.email,
        client_reference_id: req?.user?._id?.toString(),
        mode: "payment",
        metadata: {
          ...shippingInfo,
          itemsPrice: body?.itemsPrice?.toString(),
          userId: req?.user?._id?.toString(),
        },
        shipping_options: [
          {
            shipping_rate,
          },
        ],
        line_items,
      });

      res.status(200).json({
        success: true,
        url: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      console.error("Stripe checkout session error:", error);
      return next(new ErrorHandler("Failed to create payment session", 500));
    }
  },
);

// Get order items from line items
const getOrderItems = async (line_items) => {
  const cartItems = [];

  // Use for...of instead of forEach with await
  for (const item of line_items?.data || []) {
    const product = await stripe.products.retrieve(item.price.product);
    const productId = product.metadata.productId;

    cartItems.push({
      product: productId,
      name: product.name,
      price: parseFloat((item.price.unit_amount_decimal / 100).toFixed(2)),
      quantity: item.quantity,
      image: product.images[0] || "",
    });
  }

  return cartItems;
};

// Check if order already exists for this session
const checkExistingOrder = async (sessionId) => {
  const existingOrder = await Order.findOne({
    "paymentInfo.id": sessionId,
  });
  return existingOrder;
};

// Create new order after payment   =>  /api/v1/payment/webhook
export const stripeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      console.error("Webhook: Missing stripe-signature header");
      return res.status(400).json({ error: "Missing signature" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Log webhook event
    console.log(`Webhook: Received event ${event.type} (ID: ${event.id})`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Check for idempotency - prevent duplicate order creation
      const existingOrder = await checkExistingOrder(session.id);
      if (existingOrder) {
        console.log(`Webhook: Order already exists for session ${session.id}`);
        return res.status(200).json({
          received: true,
          message: "Order already processed",
        });
      }

      // Validate required session data
      if (!session.client_reference_id) {
        console.error("Webhook: Missing client_reference_id in session");
        return res.status(400).json({ error: "Invalid session data" });
      }

      if (!session.metadata || !session.metadata.address) {
        console.error("Webhook: Missing shipping metadata in session");
        return res.status(400).json({ error: "Invalid session metadata" });
      }

      // Retrieve line items
      let line_items;
      try {
        line_items = await stripe.checkout.sessions.listLineItems(session.id);
      } catch (error) {
        console.error(
          `Webhook: Failed to retrieve line items: ${error.message}`,
        );
        return res
          .status(500)
          .json({ error: "Failed to retrieve order items" });
      }

      if (!line_items || !line_items.data || line_items.data.length === 0) {
        console.error("Webhook: No line items found in session");
        return res.status(400).json({ error: "No items in order" });
      }

      // Get order items
      const orderItems = await getOrderItems(line_items);

      const user = session.client_reference_id;
      const totalAmount = session.amount_total / 100;
      const taxAmount = (session.total_details?.amount_tax || 0) / 100;
      const shippingAmount =
        (session.total_details?.amount_shipping || 0) / 100;
      const itemsPrice = parseFloat(session.metadata.itemsPrice) || 0;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city || "",
        phoneNo: session.metadata.phoneNo || "",
        zipCode: session.metadata.zipCode || "",
        country: session.metadata.country || "",
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };

      // Create order
      try {
        await Order.create(orderData);
        console.log(
          `Webhook: Order created successfully for session ${session.id}`,
        );
      } catch (error) {
        console.error(`Webhook: Failed to create order: ${error.message}`);
        return res.status(500).json({ error: "Failed to create order" });
      }

      // Send successful response
      res.status(200).json({
        received: true,
        success: true,
      });
    } else {
      // Acknowledge other event types
      res.status(200).json({
        received: true,
        eventType: event.type,
      });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    // Return 200 to prevent Stripe from retrying if it's a handled error
    res.status(200).json({
      received: true,
      error: error.message,
    });
  }
};
