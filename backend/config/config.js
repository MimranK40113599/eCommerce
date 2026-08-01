import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, "config.env");
dotenv.config({ path: envPath });

// Environment variable validation
const requiredEnvVars = {
  // Server
  PORT: { default: "4000", description: "Server port" },
  NODE_ENV: { default: "DEVELOPMENT", description: "Environment mode" },
  FRONTEND_URL: {
    default: "http://localhost:3000",
    description: "Frontend URL",
  },

  // Database
  DB_LOCAL_URI: {
    required: true,
    description: "Local database URI (required for development)",
  },
  DB_URI: {
    required: false,
    description: "Production database URI (required for production)",
  },

  // JWT
  JWT_SECRET: {
    required: true,
    description: "JWT secret key (required)",
  },
  JWT_EXPIRES_TIME: { default: "7d", description: "JWT expiration time" },
  COOKIE_EXPIRES_TIME: {
    default: "7",
    description: "Cookie expiration in days",
  },

  // Email
  SMTP_HOST: { required: false, description: "SMTP host" },
  SMTP_PORT: { default: "2525", description: "SMTP port" },
  SMTP_EMAIL: { required: false, description: "SMTP email" },
  SMTP_PASSWORD: { required: false, description: "SMTP password" },
  SMTP_FROM_EMAIL: { default: "noreply@shopit.com", description: "From email" },
  SMTP_FROM_NAME: { default: "ShopIT", description: "From name" },

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: {
    required: false,
    description: "Cloudinary cloud name",
  },
  CLOUDINARY_API_KEY: { required: false, description: "Cloudinary API key" },
  CLOUDINARY_API_SECRET: {
    required: false,
    description: "Cloudinary API secret",
  },

  // Stripe
  STRIPE_SECRET_KEY: { required: false, description: "Stripe secret key" },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    description: "Stripe webhook secret",
  },
};

/**
 * Validate environment variables
 */
const validateEnv = () => {
  const missing = [];
  const warnings = [];

  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];

    if (config.required && !value) {
      missing.push(`${key} (${config.description})`);
    }

    if (!config.required && !value && config.default) {
      process.env[key] = config.default;
      warnings.push(`${key} using default: ${config.default}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join("\n")}\n` +
        `Please check your .env file in the config folder.`,
    );
  }

  if (warnings.length > 0) {
    console.warn("⚠️  Environment warnings:");
    warnings.forEach((w) => console.warn(`   ${w}`));
  }
};

/**
 * Get configuration with type conversion
 */
const getConfig = () => {
  return {
    // Server
    port: parseInt(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || "DEVELOPMENT",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    isProduction: process.env.NODE_ENV === "PRODUCTION",
    isDevelopment: process.env.NODE_ENV === "DEVELOPMENT",
    isTest: process.env.NODE_ENV === "TEST",

    // Database
    db: {
      localUri: process.env.DB_LOCAL_URI,
      uri: process.env.DB_URI,
      getUri: () => {
        if (process.env.NODE_ENV === "PRODUCTION") {
          return process.env.DB_URI;
        }
        return (
          process.env.DB_LOCAL_URI || "mongodb://127.0.0.1:27017/shopit-v2"
        );
      },
    },

    // JWT
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_TIME || "7d",
      cookieExpires: parseInt(process.env.COOKIE_EXPIRES_TIME) || 7,
    },

    // Email
    email: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 2525,
      user: process.env.SMTP_EMAIL,
      password: process.env.SMTP_PASSWORD,
      from: {
        email: process.env.SMTP_FROM_EMAIL || "noreply@shopit.com",
        name: process.env.SMTP_FROM_NAME || "ShopIT",
      },
      isConfigured: () => {
        return !!(
          process.env.SMTP_HOST &&
          process.env.SMTP_EMAIL &&
          process.env.SMTP_PASSWORD
        );
      },
    },

    // Cloudinary
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      isConfigured: () => {
        return !!(
          process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
        );
      },
    },

    // Stripe
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      isConfigured: () => {
        return !!process.env.STRIPE_SECRET_KEY;
      },
    },

    // CORS
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  };
};

// Validate environment on import
try {
  validateEnv();
} catch (error) {
  console.error("❌ Environment validation failed:", error.message);
  process.exit(1);
}

// Export configuration
const config = getConfig();

export default config;

// Export individual config sections
export const { port, nodeEnv, frontendUrl, isProduction, isDevelopment } =
  config;
export const db = config.db;
export const jwt = config.jwt;
export const email = config.email;
export const cloudinary = config.cloudinary;
export const stripe = config.stripe;
export const cors = config.cors;
