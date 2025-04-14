import { Request, Response } from "express";
import { getFromS3 } from "../../services/s3/s3Service";

export const getFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const fileData = await getFromS3(fileName);
    res.send(fileData.Body);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'File not found' });
  }
};
