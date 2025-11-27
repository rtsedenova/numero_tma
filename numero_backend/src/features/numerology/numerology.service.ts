import s3 from '../s3/awsClient';
import { AWS_CONFIG } from '../../config/awsConfig';

export interface NumDataEntry {
  number?: number;
  title?: string;
  description?: string;
  strong_points?: string[];
  weak_points?: string[];
  recommendations?: string[];
  famous_people?: Array<{
    name: string;
    birth_date: string;
    description: string;
    image_url: string;
  }>;
  [key: string]: any;
}

interface NumData {
  [key: string]: NumDataEntry;
}

// Cache for num_data.json
let cachedNumData: NumData | null = null;

/**
 * Fetches file from S3 (reproduced logic from getFile.service.ts)
 */
async function getFileFromS3(fileName: string) {
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
}

/**
 * Fetches and caches num_data.json from S3
 */
async function getNumData(): Promise<NumData> {
  if (cachedNumData) {
    return cachedNumData;
  }

  try {
    const s3Response = await getFileFromS3('num_data.json');
    
    if (!s3Response.Body) {
      throw new Error('No data returned from S3');
    }

    const fileContent = s3Response.Body.toString('utf-8');
    cachedNumData = JSON.parse(fileContent);
    
    return cachedNumData as NumData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch numerology data from S3: ${error.message}`);
    }
    throw new Error('Unknown error while fetching numerology data');
  }
}

/**
 * Gets interpretation for a specific destiny number
 */
export async function getInterpretationForNumber(number: number): Promise<NumDataEntry | null> {
  try {
    const numData = await getNumData();
    
    // Convert number to string key as JSON keys are strings
    const key = number.toString();
    
    if (!numData[key]) {
      console.warn(`No interpretation found for number: ${number}`);
      return null;
    }

    return numData[key];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get interpretation: ${error.message}`);
    }
    throw new Error('Unknown error while getting interpretation');
  }
}

/**
 * Clears the cached data (useful for testing or forcing refresh)
 */
export function clearCache(): void {
  cachedNumData = null;
}

