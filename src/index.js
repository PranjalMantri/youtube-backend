import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      throw error;
    });

    app.listen(port, () => {});
  })
  .catch((err) => console.error("Database connection failed", err.message));
