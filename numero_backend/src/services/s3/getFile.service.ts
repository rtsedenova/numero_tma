import s3 from '../../utils/awsClient';
import { AWS_CONFIG } from '../../config/awsConfig';

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
      throw new Error(`Ошибка во время получения данных из S3: ${error.message}`);
    } else {
      throw new Error('Неизвестная ошибка во время получения файла из S3');
    }
  }
};
