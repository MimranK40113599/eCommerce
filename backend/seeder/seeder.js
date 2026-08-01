import mongoose from "mongoose";
import dotenv from "dotenv";
import { program } from "commander";
import chalk from "chalk";
import products from "./data.js";
import Product from "../models/product.js";
import User from "../models/user.js";

// Load environment variables
dotenv.config();

// Configure command line options
program
  .option("-c, --clear", "Clear existing products before seeding")
  .option("-u, --update", "Update existing products (skip if exists)")
  .option("-a, --admin <email>", "Admin email to associate products with")
  .option(
    "-d, --dry-run",
    "Dry run - show what would be done without executing",
  )
  .parse(process.argv);

const options = program.opts();

// Colors for console output
const info = chalk.blue;
const success = chalk.green;
const warning = chalk.yellow;
const error = chalk.red;

// Validate environment variables
const validateEnvironment = () => {
  const required = ["DB_URI", "NODE_ENV"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      error(`Missing required environment variables: ${missing.join(", ")}`),
    );
    console.error(info(`Please check your .env file`));
    process.exit(1);
  }
};

// Get admin user
const getAdminUser = async (adminEmail) => {
  try {
    let query = {};

    if (adminEmail) {
      query = { email: adminEmail };
    } else {
      // Try to find any admin user
      query = { role: "admin" };
    }

    const admin = await User.findOne(query);

    if (!admin) {
      console.warn(
        warning(
          `No admin user found${adminEmail ? ` with email: ${adminEmail}` : ""}`,
        ),
      );
      console.info(
        info(
          "Please create an admin user first or specify an existing admin email",
        ),
      );
      console.info(info("Example: npm run seed -- --admin admin@example.com"));

      // Ask if user wants to continue with a default user ID
      console.info(warning("Continuing with a placeholder user ID..."));
      console.info(
        warning("You'll need to update the products manually later."),
      );

      return null;
    }

    return admin;
  } catch (error) {
    console.error(error("Failed to find admin user:", error.message));
    return null;
  }
};

// Update product data with admin user ID
const updateProductData = (products, adminId) => {
  return products.map((product) => ({
    ...product,
    user: adminId || "000000000000000000000000", // Placeholder if no admin
    // Remove any existing reviews that don't have user references
    reviews: [],
    // These will be auto-calculated
    ratings: 0,
    numOfReviews: 0,
  }));
};

// Main seeding function
const seedProducts = async () => {
  try {
    // Validate environment
    validateEnvironment();

    // Connect to MongoDB
    console.info(info("Connecting to MongoDB..."));
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(success("Connected to MongoDB successfully"));

    // Get admin user
    let adminId = null;
    const admin = await getAdminUser(options.admin);
    if (admin) {
      adminId = admin._id;
      console.log(success(`Found admin user: ${admin.email} (${admin._id})`));
    }

    // Prepare products data
    let productsToSeed = updateProductData(products, adminId);

    // Dry run - show what would happen
    if (options.dryRun) {
      console.info(info("\n===== DRY RUN ====="));
      console.info(info(`Would seed ${productsToSeed.length} products`));
      console.info(
        info(`Products: ${productsToSeed.map((p) => p.name).join(", ")}`),
      );
      console.info(info("==================="));
      process.exit(0);
    }

    // Ask for confirmation in production
    if (process.env.NODE_ENV === "production") {
      console.warn(
        warning(
          "\n⚠️  WARNING: You are about to seed products in PRODUCTION environment!",
        ),
      );
      console.warn(warning("This will delete existing product data."));
      console.warn(
        warning("Press Ctrl+C to cancel or wait 10 seconds to continue..."),
      );

      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log(info("Continuing with seeding..."));
    }

    // Clear existing products if requested
    if (options.clear) {
      console.info(info("Clearing existing products..."));
      await Product.deleteMany({});
      console.log(success("All products deleted"));
    }

    // Seed products
    console.info(info(`Seeding ${productsToSeed.length} products...`));

    if (options.update) {
      // Update mode - update existing or insert new
      let updated = 0;
      let inserted = 0;

      for (const productData of productsToSeed) {
        const existing = await Product.findOne({ slug: productData.slug });
        if (existing) {
          await Product.updateOne({ _id: existing._id }, productData);
          updated++;
        } else {
          await Product.create(productData);
          inserted++;
        }
      }

      console.log(
        success(
          `Updated ${updated} existing products, inserted ${inserted} new products`,
        ),
      );
    } else {
      // Normal mode - insert all
      await Product.insertMany(productsToSeed);
      console.log(
        success(`Successfully seeded ${productsToSeed.length} products`),
      );
    }

    // Show summary
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    console.log(info("\n===== SEED SUMMARY ====="));
    console.log(success(`Total products: ${totalProducts}`));
    console.log(success(`Active products: ${activeProducts}`));
    console.log(warning(`Out of stock: ${outOfStock}`));
    console.log(info("======================="));

    process.exit(0);
  } catch (error) {
    console.error(error("Seeding failed:"), error.message);
    console.error(error("Error details:"), error.stack);

    // Clean up database connection
    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

// Run seeder
seedProducts();
