import AWS from 'aws-sdk';
import { AWS_CONFIG } from '../../config/awsConfig';

const s3 = new AWS.S3({
  accessKeyId: AWS_CONFIG.accessKeyId,
  secretAccessKey: AWS_CONFIG.secretAccessKey,
  region: AWS_CONFIG.region,
});

export const uploadToS3 = async (fileName: string, fileContent: Buffer) => {
  const params = {
    Bucket: AWS_CONFIG.bucketName,
    Key: fileName,
    Body: fileContent,
  };

  return s3.upload(params).promise();
};
