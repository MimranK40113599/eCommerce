import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", "config", "config.env") });

// Validate required environment variables
const requiredConfig = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missingConfig = requiredConfig.filter((key) => !process.env[key]);

if (missingConfig.length > 0) {
  console.error(
    `Missing Cloudinary configuration: ${missingConfig.join(", ")}`,
  );
  console.error("Please check your environment variables");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000, // 60 seconds
});

// Test Cloudinary connection
const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    return result.status === "ok";
  } catch (error) {
    console.error("Cloudinary connection test failed:", error.message);
    return false;
  }
};

/**
 * Upload file to Cloudinary with retry logic
 */
export const upload_file = async (file, folder, options = {}) => {
  // Validate file input
  if (!file) {
    throw new Error("No file provided for upload");
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (Buffer.isBuffer(file) && file.length > maxSize) {
    throw new Error(
      `File size exceeds maximum allowed size (${maxSize / (1024 * 1024)}MB)`,
    );
  }

  const defaultOptions = {
    resource_type: "auto",
    folder: folder || "shopit",
    timeout: 60000,
    eager: options.eager || [],
    eager_async: options.eager_async || false,
    eager_notification_url: options.eager_notification_url || null,
    quality: options.quality || "auto",
    fetch_format: options.fetch_format || "auto",
    transformation: options.transformation || [],
  };

  const uploadOptions = { ...defaultOptions, ...options };

  // Retry configuration
  const maxRetries = 3;
  const initialDelay = 1000; // 1 second

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          file,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
          uploadOptions,
        );
      });

      // Return formatted response
      return {
        public_id: result.public_id,
        url: result.secure_url || result.url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
        resource_type: result.resource_type,
        eager: result.eager || [],
      };
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error.message.includes("invalid") ||
        error.message.includes("not found") ||
        error.message.includes("bad request") ||
        error.http_code === 400 ||
        error.http_code === 401
      ) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
      }

      // Exponential backoff
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(
          `Cloudinary upload retry ${attempt}/${maxRetries} after ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Cloudinary upload failed after ${maxRetries} retries: ${lastError?.message || "Unknown error"}`,
  );
};

/**
 * Delete file from Cloudinary with retry logic
 */
export const delete_file = async (file) => {
  if (!file) {
    throw new Error("No file public_id provided for deletion");
  }

  const maxRetries = 3;
  const initialDelay = 1000;

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(file, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      if (result?.result === "ok") {
        return true;
      } else if (result?.result === "not found") {
        // File doesn't exist, consider it deleted
        return true;
      } else {
        throw new Error(
          `Cloudinary deletion failed: ${result?.result || "Unknown error"}`,
        );
      }
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed, but we might want to consider it a success if file not found
  if (lastError?.message?.includes("not found")) {
    return true;
  }

  throw new Error(
    `Cloudinary deletion failed after ${maxRetries} retries: ${lastError?.message || "Unknown error"}`,
  );
};

/**
 * Get file details from Cloudinary
 */
export const get_file_details = async (public_id) => {
  if (!public_id) {
    throw new Error("No public_id provided");
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.api.resource(public_id, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      created_at: result.created_at,
      resource_type: result.resource_type,
    };
  } catch (error) {
    if (error.http_code === 404) {
      return null; // Resource not found
    }
    throw new Error(`Failed to get file details: ${error.message}`);
  }
};

/**
 * Get multiple file details
 */
export const get_multiple_files_details = async (public_ids) => {
  if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
    return [];
  }

  try {
    const results = await Promise.allSettled(
      public_ids.map((id) => get_file_details(id)),
    );

    return results
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);
  } catch (error) {
    throw new Error(`Failed to get files details: ${error.message}`);
  }
};

/**
 * Update file transformation
 */
export const update_file_transformation = async (public_id, transformation) => {
  if (!public_id) {
    throw new Error("No public_id provided");
  }

  if (!transformation || typeof transformation !== "object") {
    throw new Error("Invalid transformation configuration");
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.api.update(public_id, transformation, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return result;
  } catch (error) {
    throw new Error(`Failed to update file transformation: ${error.message}`);
  }
};

// Export connection test for health checks
export const checkCloudinaryConnection = testConnection;

export default {
  upload_file,
  delete_file,
  get_file_details,
  get_multiple_files_details,
  update_file_transformation,
  checkCloudinaryConnection,
};
