import mongoose from "mongoose";
import "dotenv/config";
const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully...");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;