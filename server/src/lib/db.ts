import mongoose from "mongoose";

export async function dbConnect() {
  const mongodb_uri = process.env.MONGODB_URI;
  if (!mongodb_uri) {
    console.log("Missing mongodb uri");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongodb_uri);
    console.log("Successfully connected to mongodb!");
  } catch (e: any) {
    console.log("Something went wrong!", e.message);
    process.exit(1);
  }
}
