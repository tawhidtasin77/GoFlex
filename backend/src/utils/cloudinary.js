import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // console.log("file uploaded on cloudinary successfully. url: ", response.url);
        // fs.unlinkSync(localFilePath);

        return {
            url: response.secure_url,
            publicId: response.public_id
        }
        
    } catch (error) {
        // console.log("========== CLOUDINARY ERROR ==========");
        // console.log(error);
        // console.log("Error message:", error.message);
        // console.log("======================================");

        if(localFilePath && fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
        return null;
        
    }
}

export { uploadOnCloudinary }