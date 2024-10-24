import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3Client"; // Your S3 client setup
import { Request } from "express";


interface CustomRequest extends Request {
    file?: Express.Multer.File; // Use Express.Multer.File type for files
}


export const uploadImageToS3 = async (req: CustomRequest) => {
    if (!req.file) {
        console.log("No file uploaded");
        return; 
    }

    const fileContent = Buffer.from(req.file.buffer);

    const fileName = `${Date.now().toString()}-${req.file.originalname}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: fileContent,
        ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    try {
        await s3.send(command);
        console.log(`File uploaded successfully: ${fileName}`);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.log("Error uploading file:", error);
    }
};
