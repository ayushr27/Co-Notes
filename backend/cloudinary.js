import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export function ensureCloudinaryConfigured() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        const error = new Error("Cloudinary is not configured");
        error.status = 500;
        throw error;
    }
}

export async function uploadImageToCloudinary(dataUri, folder) {
    ensureCloudinaryConfigured();
    return cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "image"
    });
}

export default cloudinary;
