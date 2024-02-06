import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config();

connectDB();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error", error.message);
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Listening example app on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Error", error.message);
//   }
// })();
