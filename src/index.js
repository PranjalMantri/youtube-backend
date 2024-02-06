import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Database connection failed");
      throw error;
    });

    app.listen(port, () => {
      console.log(`Example app listening on ${port}`);
    });
  })
  .catch((err) => console.error("Database connection failed", err.message));
