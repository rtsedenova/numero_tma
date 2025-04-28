import s3 from '../../utils/awsClient';

export const uploadFileToS3 = async (fileName: string, fileContent: Buffer) => {
  const params = {
    Bucket: process.env.BUCKET_NAME || '', 
    Key: fileName,
    Body: fileContent,
  };

  try {
    const data = await s3.upload(params).promise();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Ошибка во время загрузки файла в S3: ${error.message}`);
    } else {
      throw new Error('Неизвестная ошибка во время загрузки файла в S3');
    }
  }
};
