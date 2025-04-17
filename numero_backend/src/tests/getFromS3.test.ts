jest.mock('../config/awsConfig', () => ({
  AWS_CONFIG: {
    accessKeyId: 'mock-access-key',
    secretAccessKey: 'mock-secret-key',
    region: 'mock-region',
    bucketName: 'mock-bucket',
  },
}));

import AWS from 'aws-sdk';
import { getFromS3 } from '../services/s3/getFromS3';

jest.mock('aws-sdk', () => {
  const getObjectMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({ Body: 'test-content' }),
  });

  return {
    S3: jest.fn(() => ({
      getObject: getObjectMock,
    })),
  };
});

describe('getFromS3', () => {
  it('должен вернуть содержимое объекта из S3', async () => {
    const fileName = 'test-file.txt';
    const result = await getFromS3(fileName);

    expect(result).toEqual({ Body: 'test-content' });
  });

  it('должен вызвать getObject с правильными параметрами', async () => {
    const fileName = 'test-file.txt';
    const s3Instance = new AWS.S3();
    const getObjectSpy = jest.spyOn(s3Instance, 'getObject');

    await getFromS3(fileName);

    expect(getObjectSpy).toHaveBeenCalledWith({
      Bucket: 'mock-bucket',
      Key: fileName,
    });
  });
});
