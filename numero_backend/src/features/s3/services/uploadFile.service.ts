import s3 from '../awsClient';
import { AWS_CONFIG } from '../../../config/awsConfig';

export const uploadFileToS3 = async (fileName: string, fileContent: Buffer) => {
  const params = {
    Bucket: AWS_CONFIG.bucketName,
    Key: fileName,
    Body: fileContent,
  };

  try {
    const data = await s3.upload(params).promise();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error uploading file to S3: ${error.message}`);
    } else {
      throw new Error('Unknown error uploading file to S3');
    }
  }
};

