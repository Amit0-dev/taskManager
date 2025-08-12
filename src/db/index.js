import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection Established ✅")
    } catch (error) {
        throw new Error("Connection failed ❌");
    }
}

export {connectDB}