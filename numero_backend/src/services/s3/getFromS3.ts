import AWS from 'aws-sdk';
import { AWS_CONFIG } from '../../config/awsConfig';

const s3 = new AWS.S3({
  accessKeyId: AWS_CONFIG.accessKeyId,
  secretAccessKey: AWS_CONFIG.secretAccessKey,
  region: AWS_CONFIG.region,
});

export const getFromS3 = async (fileName: string) => {
  const params = {
    Bucket: AWS_CONFIG.bucketName,
    Key: fileName,
  };

  return s3.getObject(params).promise();
};
