import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import AWS from 'aws-sdk';
import { uploadToS3 } from '../services/s3/uploadToS3'; 

jest.mock('aws-sdk', () => {
  const uploadMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({ Location: 'https://s3.amazonaws.com/bucket/test.txt' }),
  });

  return {
    S3: jest.fn(() => ({
      upload: uploadMock,
    })),
  };
});

describe('uploadToS3', () => {
  const fileName = 'test.txt';
  const fileContent = Buffer.from('Hello, S3!');

  it('должен вернуть URL загруженного файла', async () => {
    const result = await uploadToS3(fileName, fileContent);
    expect(result).toEqual({ Location: 'https://s3.amazonaws.com/bucket/test.txt' });
  });

  it('должен вызвать upload с правильными параметрами', async () => {
    const mockS3Instance = new AWS.S3();
    const uploadSpy = jest.spyOn(mockS3Instance, 'upload');

    await uploadToS3(fileName, fileContent);

    expect(uploadSpy).toHaveBeenCalledWith({
      Bucket: expect.any(String),
      Key: fileName,
      Body: fileContent,
    });
  });
});
