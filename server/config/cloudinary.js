import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv';

dotenv.config();

const uploadOnCloudinary = async (fileBuffer, mimetype) => {
    try {
        if (!fileBuffer) return null;

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const fileBase64 = fileBuffer.toString('base64');
        const fileUri = `data:${mimetype};base64,${fileBase64}`;

        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type: 'auto',
        });

        return result.secure_url;
    }
    catch (error) {
        console.log("Cloudinary Error:", error);
        return null;
    }
}

export default uploadOnCloudinary;