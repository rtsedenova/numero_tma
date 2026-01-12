import s3 from '../awsClient';
import { AWS_CONFIG } from '../../../config/awsConfig';

export const getFileFromS3 = async (fileName: string) => {
  const params = {
    Bucket: AWS_CONFIG.bucketName, 
    Key: fileName,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error getting file from S3: ${error.message}`);
    } else {
      throw new Error('Unknown error getting file from S3');
    }
  }
};

