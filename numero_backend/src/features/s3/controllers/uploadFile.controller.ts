import { Request, Response } from "express";
import { uploadFileToS3 } from "../services/s3Service";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "File not uploaded" });
    }

    const result = await uploadFileToS3(req.file.originalname, req.file.buffer);
    res.json({ message: "File uploaded to S3", data: result });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Server error" });
  }
};

