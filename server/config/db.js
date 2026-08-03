import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.log("error access database connection string");
    process.exit(1);
}

const connectDB = async () => {
    try {
        mongoose.connect(MONGO_URI,{
             dbName: 'gtonline' 
    });
        console.log("Database connected successfully...");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;