import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv';

dotenv.config();

const uploadOnCloudinary = async (fileSource, mimetype = null) => {
    try {
        if (!fileSource) return null;

        let uploadTarget = fileSource;

        if (Buffer.isBuffer(fileSource)) {
            const fileBase64 = fileSource.toString('base64');
            uploadTarget = `data:${mimetype};base64,${fileBase64}`;
        }

        const result = await cloudinary.uploader.upload(uploadTarget, {
            resource_type: 'auto',
            folder: 'vibe_uploads'
        });

        if (typeof fileSource === 'string' && fs.existsSync(fileSource)) {
            fs.unlinkSync(fileSource);
        }

        return result.secure_url;
    }
    catch (error) {
        if (typeof fileSource === 'string' && fs.existsSync(fileSource)) {
            fs.unlinkSync(fileSource);
        }
        console.error("Cloudinary Error:", error);
        return null;
    }
}

export default uploadOnCloudinary;