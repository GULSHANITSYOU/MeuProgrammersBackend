import mongoose from "mongoose";
import { DbName } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DbName}`
    );

    console.log(
      `\n mongoDB is connected! at Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`mongoDB connection is Faild : ${error}`);
    process.exit(1);
  }
};

