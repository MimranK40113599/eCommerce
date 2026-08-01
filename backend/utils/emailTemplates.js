// Email template configuration
const config = {
  companyName: process.env.COMPANY_NAME || "ShopIT",
  supportEmail: process.env.SUPPORT_EMAIL || "support@shopit.com",
  supportUrl: process.env.SUPPORT_URL || "https://shopit.com/support",
  companyAddress: process.env.COMPANY_ADDRESS || "1234 Street Rd., Suite 1234",
  companyCity: process.env.COMPANY_CITY || "New York, NY 10001",
  logoUrl: process.env.LOGO_URL || "https://shopit.com/logo.png",
  websiteUrl: process.env.WEBSITE_URL || "https://shopit.com",
};

/**
 * Get base email template with header and footer
 */
const getBaseTemplate = (content, title = "") => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${title || config.companyName}</title>
    <style type="text/css" rel="stylesheet" media="all">
      @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #3869d4;
      }
      a img {
        border: none;
      }
      td {
        word-break: break-word;
      }
      .preheader {
        display: none !important;
        visibility: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      }
      body, td, th {
        font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
      }
      h1 {
        margin-top: 0;
        color: #333333;
        font-size: 22px;
        font-weight: bold;
        text-align: left;
      }
      h2 {
        margin-top: 0;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }
      td, th {
        font-size: 16px;
      }
      p, ul, ol, blockquote {
        margin: 0.4em 0 1.1875em;
        font-size: 16px;
        line-height: 1.625;
      }
      p.sub {
        font-size: 13px;
      }
      .align-right { text-align: right; }
      .align-left { text-align: left; }
      .align-center { text-align: center; }
      .u-margin-bottom-none { margin-bottom: 0; }
      .button {
        background-color: #3869d4;
        border-top: 10px solid #3869d4;
        border-right: 18px solid #3869d4;
        border-bottom: 10px solid #3869d4;
        border-left: 18px solid #3869d4;
        display: inline-block;
        color: #fff !important;
        text-decoration: none;
        border-radius: 3px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
        -webkit-text-size-adjust: none;
        box-sizing: border-box;
      }
      .button--green {
        background-color: #22bc66;
        border-top: 10px solid #22bc66;
        border-right: 18px solid #22bc66;
        border-bottom: 10px solid #22bc66;
        border-left: 18px solid #22bc66;
      }
      .button--red {
        background-color: #ff6136;
        border-top: 10px solid #ff6136;
        border-right: 18px solid #ff6136;
        border-bottom: 10px solid #ff6136;
        border-left: 18px solid #ff6136;
      }
      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
          text-align: center !important;
        }
      }
      body {
        background-color: #f2f4f6;
        color: #51545e;
      }
      p {
        color: #51545e;
      }
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #f2f4f6;
      }
      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }
      .email-masthead_name {
        font-size: 24px;
        font-weight: bold;
        color: #333333;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        background-color: #ffffff;
      }
      .email-footer {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        text-align: center;
      }
      .email-footer p {
        color: #a8aaaf;
      }
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        text-align: center;
      }
      .body-sub {
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px solid #eaeaec;
      }
      .content-cell {
        padding: 45px;
      }
      .social-icons {
        margin: 20px 0;
      }
      .social-icon {
        margin: 0 8px;
        display: inline-block;
      }
      @media only screen and (max-width: 600px) {
        .email-body_inner, .email-footer {
          width: 100% !important;
        }
      }
      @media (prefers-color-scheme: dark) {
        body, .email-body, .email-body_inner, .email-content, .email-wrapper, .email-masthead, .email-footer {
          background-color: #333333 !important;
          color: #fff !important;
        }
        p, ul, ol, blockquote, h1, h2, h3, span {
          color: #fff !important;
        }
        .email-masthead_name {
          color: #fff !important;
          text-shadow: none !important;
        }
        .button {
          color: #fff !important;
        }
      }
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }
    </style>
  </head>
  <body>
    <span class="preheader">${config.companyName} - ${title}</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <a href="${config.websiteUrl}" class="email-masthead_name">
                  ${config.companyName}
                </a>
              </td>
            </tr>
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell">
                      ${content}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                      <p class="f-fallback sub align-center">
                        ${config.companyName}<br />
                        ${config.companyAddress}<br />
                        ${config.companyCity}
                      </p>
                      <p class="f-fallback sub align-center">
                        <a href="${config.supportUrl}">Contact Support</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};

/**
 * Get password reset email template
 */
export const getResetPasswordTemplate = (username, resetUrl) => {
  if (!username || !resetUrl) {
    throw new Error(
      "Username and reset URL are required for password reset template",
    );
  }

  const content = `
    <div class="f-fallback">
      <h1>Hi ${username},</h1>
      <p>
        You recently requested to reset your password for your
        ${config.companyName} account. Use the button below to reset it.
        <strong>This password reset is only valid for the next 30 minutes.</strong>
      </p>

      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
                <td align="center">
                  <a href="${resetUrl}" class="button button--green" target="_blank">
                    Reset your password
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <p>
        If you did not request a password reset, please ignore this email or
        <a href="${config.supportUrl}">contact support</a> if you have questions.
      </p>
      
      <p>Thanks, <br />The ${config.companyName} team</p>

      <table class="body-sub" role="presentation">
        <tr>
          <td>
            <p class="f-fallback sub">
              If you're having trouble with the button above, copy and paste the URL below into your web browser.
            </p>
            <p class="f-fallback sub">
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  return getBaseTemplate(content, "Password Reset");
};

/**
 * Get welcome email template
 */
export const getWelcomeTemplate = (username) => {
  if (!username) {
    throw new Error("Username is required for welcome template");
  }

  const content = `
    <div class="f-fallback">
      <h1>Welcome to ${config.companyName}, ${username}!</h1>
      <p>Thank you for creating an account with ${config.companyName}. We're excited to have you on board!</p>
      
      <p>With your account, you can:</p>
      <ul>
        <li>Browse our catalog of products</li>
        <li>Place orders</li>
        <li>Track your orders</li>
        <li>Manage your profile</li>
      </ul>

      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
                <td align="center">
                  <a href="${config.websiteUrl}" class="button button--green" target="_blank">
                    Start Shopping
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p>
        If you have any questions, don't hesitate to 
        <a href="${config.supportUrl}">contact our support team</a>.
      </p>
      
      <p>Happy shopping! <br />The ${config.companyName} team</p>
    </div>
  `;

  return getBaseTemplate(content, "Welcome to " + config.companyName);
};

/**
 * Get order confirmation email template
 */
export const getOrderConfirmationTemplate = (
  username,
  orderId,
  totalAmount,
  items,
) => {
  if (
    !username ||
    !orderId ||
    !totalAmount ||
    !items ||
    !Array.isArray(items)
  ) {
    throw new Error(
      "All order details are required for order confirmation template",
    );
  }

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 0;">${item.name}</td>
      <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 0; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  const content = `
    <div class="f-fallback">
      <h1>Order Confirmation</h1>
      <p>Hi ${username},</p>
      <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
      
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #eaeaec;">
            <th style="text-align: left; padding: 10px 0;">Item</th>
            <th style="text-align: center; padding: 10px 0;">Quantity</th>
            <th style="text-align: right; padding: 10px 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="border-top: 2px solid #eaeaec;">
            <td colspan="2" style="text-align: right; padding: 10px 0;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 10px 0;"><strong>$${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <a href="${config.websiteUrl}/orders/${orderId}" class="button button--green" target="_blank">
              View Order Details
            </a>
          </td>
        </tr>
      </table>

      <p>Thanks for shopping with us! <br />The ${config.companyName} team</p>
    </div>
  `;

  return getBaseTemplate(content, "Order Confirmation #" + orderId);
};

// Export all templates
export default {
  getResetPasswordTemplate,
  getWelcomeTemplate,
  getOrderConfirmationTemplate,
};
