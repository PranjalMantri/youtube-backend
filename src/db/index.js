import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async function () {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URI}/${DB_NAME}`
    );
    console.log("\n MongoDB Connected");
  } catch (error) {
    console.error("Database connection error");
    process.exit(1);
  }
};

export default connectDB;
