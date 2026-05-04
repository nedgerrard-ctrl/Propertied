import { v2 as cloudinary } from "cloudinary";

// Automatically reads CLOUDINARY_URL from environment
cloudinary.config(true);

export default cloudinary;
