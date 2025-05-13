import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI, {});
        console.log(`MongoDB Connected: `);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}