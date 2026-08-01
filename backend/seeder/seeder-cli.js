#!/usr/bin/env node

import { Command } from "commander";
import dotenv from "dotenv";
import chalk from "chalk";
import inquirer from "inquirer";
import {
  seedProducts,
  clearProducts,
  exportProducts,
  importProducts,
} from "./seedOperations.js";

dotenv.config();

const program = new Command();
const { error, success, info, warning } = chalk;

program
  .name("shopit-seeder")
  .description("Database seeding utility for ShopIT eCommerce")
  .version("1.0.0");

program
  .command("seed")
  .description("Seed products into database")
  .option("-c, --clear", "Clear existing products first")
  .option("-a, --admin <email>", "Admin email to associate products with")
  .option("-d, --dry-run", "Show what would be done")
  .action(async (cmd) => {
    try {
      await seedProducts(cmd);
    } catch (err) {
      console.error(error("Error:", err.message));
      process.exit(1);
    }
  });

program
  .command("clear")
  .description("Clear all products from database")
  .option("-f, --force", "Skip confirmation prompt")
  .action(async (cmd) => {
    if (!cmd.force) {
      const { confirm } = await inquirer.prompt({
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to delete ALL products?",
        default: false,
      });

      if (!confirm) {
        console.log(info("Operation cancelled"));
        process.exit(0);
      }
    }

    await clearProducts();
  });

program
  .command("export")
  .description("Export products to JSON file")
  .option("-f, --file <path>", "Output file path", "./exported-products.json")
  .action(async (cmd) => {
    await exportProducts(cmd.file);
  });

program
  .command("import")
  .description("Import products from JSON file")
  .option("-f, --file <path>", "Input file path", "./products.json")
  .option("-c, --clear", "Clear existing products first")
  .action(async (cmd) => {
    await importProducts(cmd.file, cmd.clear);
  });

program.parse();
