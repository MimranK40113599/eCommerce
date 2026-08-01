import nodemailer from "nodemailer";
import { validate } from "email-validator";
import { RateLimiter } from "limiter";

// Email rate limiter - prevent abuse
const emailLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: "minute",
});

// Email configuration validation
const validateConfig = () => {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_EMAIL", "SMTP_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(", ")}`);
  }

  // Validate port is a number
  const port = parseInt(process.env.SMTP_PORT);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error("Invalid SMTP_PORT configuration");
  }
};

// Create transporter with configuration
const createTransporter = () => {
  validateConfig();

  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: process.env.SMTP_SECURE === "true",
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  };

  // Add additional options if provided
  if (process.env.SMTP_POOL) {
    config.pool = true;
    config.maxConnections = parseInt(process.env.SMTP_MAX_CONNECTIONS) || 5;
    config.rateLimit = parseInt(process.env.SMTP_RATE_LIMIT) || 5;
  }

  return nodemailer.createTransport(config);
};

/**
 * Send email with retry logic
 */
const sendEmail = async (options) => {
  // Validate email input
  if (!options.email) {
    throw new Error("Recipient email is required");
  }

  if (!validate(options.email)) {
    throw new Error(`Invalid email address: ${options.email}`);
  }

  if (!options.subject) {
    throw new Error("Email subject is required");
  }

  if (!options.message && !options.text) {
    throw new Error("Email content (message or text) is required");
  }

  // Rate limiting
  try {
    const hasToken = await emailLimiter.tryRemoveTokens(1);
    if (!hasToken) {
      throw new Error("Email rate limit exceeded. Please try again later.");
    }
  } catch (error) {
    throw new Error(`Rate limit error: ${error.message}`);
  }

  // Validate SMTP configuration
  validateConfig();

  // Create transporter
  const transporter = createTransporter();

  // Build email message
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || "ShopIT"} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
  };

  // Add content (HTML or plain text)
  if (options.message) {
    mailOptions.html = options.message;
  }

  if (options.text) {
    mailOptions.text = options.text;
  } else if (options.message) {
    // Generate plain text from HTML if not provided
    mailOptions.text = options.message.replace(/<[^>]*>/g, "");
  }

  // Add CC and BCC if provided
  if (options.cc) {
    if (Array.isArray(options.cc)) {
      mailOptions.cc = options.cc.filter((email) => validate(email));
    } else if (validate(options.cc)) {
      mailOptions.cc = options.cc;
    }
  }

  if (options.bcc) {
    if (Array.isArray(options.bcc)) {
      mailOptions.bcc = options.bcc.filter((email) => validate(email));
    } else if (validate(options.bcc)) {
      mailOptions.bcc = options.bcc;
    }
  }

  // Add attachments if provided
  if (options.attachments && Array.isArray(options.attachments)) {
    mailOptions.attachments = options.attachments.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      path: attachment.path,
      contentType: attachment.contentType,
    }));
  }

  // Add reply-to if provided
  if (options.replyTo) {
    if (validate(options.replyTo)) {
      mailOptions.replyTo = options.replyTo;
    }
  }

  // Add headers if provided
  if (options.headers) {
    mailOptions.headers = options.headers;
  }

  // Retry logic
  const maxRetries = 3;
  const initialDelay = 1000;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Send email
      const info = await transporter.sendMail(mailOptions);

      // Log successful email
      console.log(`Email sent to ${options.email} (${info.messageId})`);

      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        envelope: info.envelope,
        response: info.response,
      };
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error.code === "EAUTH" ||
        error.code === "EENVELOPE" ||
        error.message.includes("Invalid address")
      ) {
        throw new Error(`Email configuration error: ${error.message}`);
      }

      // Exponential backoff
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(
          `Email send retry ${attempt}/${maxRetries} after ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to send email after ${maxRetries} retries: ${lastError?.message || "Unknown error"}`,
  );
};

/**
 * Send email with template
 */
export const sendTemplateEmail = async (email, subject, template, data) => {
  if (!template) {
    throw new Error("Template is required");
  }

  if (typeof template !== "function") {
    throw new Error("Template must be a function");
  }

  try {
    const message = template(data);
    return await sendEmail({
      email,
      subject,
      message,
    });
  } catch (error) {
    throw new Error(`Template rendering failed: ${error.message}`);
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmails = async (
  emailList,
  subject,
  message,
  options = {},
) => {
  if (!emailList || !Array.isArray(emailList) || emailList.length === 0) {
    throw new Error("Email list is required and must be a non-empty array");
  }

  const results = [];
  const errors = [];

  // Process emails in batches
  const batchSize = options.batchSize || 10;
  const delayBetweenBatches = options.delay || 1000;

  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    const batchPromises = batch.map(async (email) => {
      try {
        const result = await sendEmail({
          email,
          subject,
          message,
          ...options,
        });
        results.push({ email, success: true, result });
      } catch (error) {
        errors.push({ email, error: error.message });
      }
    });

    await Promise.all(batchPromises);

    // Delay between batches to avoid rate limiting
    if (i + batchSize < emailList.length) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return {
    success: errors.length === 0,
    sent: results.length,
    failed: errors.length,
    results,
    errors,
  };
};

export default sendEmail;
