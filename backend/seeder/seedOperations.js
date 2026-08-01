import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import Product from "../models/product.js";
import User from "../models/user.js";
import products from "./data.js";

const { error, success, info, warning } = chalk;

export const seedProducts = async (options) => {
  // ... seed logic
};

export const clearProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    console.log(success("All products cleared from database"));
    process.exit(0);
  } catch (err) {
    console.error(error("Failed to clear products:", err.message));
    process.exit(1);
  }
};

export const exportProducts = async (filePath) => {
  try {
    await connectDB();
    const products = await Product.find({}).lean();
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    console.log(success(`Products exported to ${filePath}`));
    process.exit(0);
  } catch (err) {
    console.error(error("Failed to export products:", err.message));
    process.exit(1);
  }
};

export const importProducts = async (filePath, clear) => {
  try {
    await connectDB();

    if (clear) {
      await Product.deleteMany({});
      console.log(info("Existing products cleared"));
    }

    const data = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(data);
    await Product.insertMany(products);
    console.log(
      success(`Imported ${products.length} products from ${filePath}`),
    );
    process.exit(0);
  } catch (err) {
    console.error(error("Failed to import products:", err.message));
    process.exit(1);
  }
};

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(info("Connected to MongoDB"));
};
