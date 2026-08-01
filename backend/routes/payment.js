import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
  // getPaymentMethods, // Add this controller method
} from "../controllers/paymentControllers.js";

const router = express.Router();

// ============================================================
// Webhook Routes - Public (Must use raw body parser)
// ============================================================

/**
 * @route   POST /api/v1/payment/webhook
 * @desc    Stripe webhook handler - MUST use raw body for signature verification
 * @access  Public (but verified via Stripe signature)
 * @note    This route must be configured with express.raw() middleware
 *          before body-parser to preserve the raw body
 *
 * In app.js, this route should be set up as:
 * app.post('/api/v1/payment/webhook', express.raw({type: 'application/json'}), stripeWebhook)
 */
router.route("/payment/webhook").post(stripeWebhook);

// ============================================================
// Protected Routes - Payment
// ============================================================

/**
 * @route   POST /api/v1/payment/checkout_session
 * @desc    Create Stripe checkout session
 * @access  Private
 */
router
  .route("/payment/checkout_session")
  .post(isAuthenticatedUser, stripeCheckoutSession);

/**
 * @route   GET /api/v1/payment/methods
 * @desc    Get available payment methods
 * @access  Private
 */
// router
//   .route("/payment/methods")
//   .get(
//     isAuthenticatedUser,
//     getPaymentMethods
//   );

/**
 * @route   POST /api/v1/payment/create_intent
 * @desc    Create payment intent (for custom payment flow)
 * @access  Private
 */
// router
//   .route("/payment/create_intent")
//   .post(
//     isAuthenticatedUser,
//     createPaymentIntent
//   );

export default router;
