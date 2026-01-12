import { getFileFromS3 } from '../s3/services/s3Service';

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

let cachedNumData: NumData | null = null;

async function getNumData(): Promise<NumData> {
  if (cachedNumData) {
    return cachedNumData;
  }

  try {
    const s3Response = await getFileFromS3('num_data.json');

    if (!s3Response.Body) {
      throw new Error('Empty S3 response');
    }

    const fileContent = s3Response.Body.toString('utf-8');
    cachedNumData = JSON.parse(fileContent);

    return cachedNumData as NumData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to load numerology data: ${error.message}`);
    }
    throw new Error('Failed to load numerology data');
  }
}

export async function getInterpretationForNumber(
  number: number,
): Promise<NumDataEntry | null> {
  try {
    const numData = await getNumData();
    const key = number.toString();

    if (!numData[key]) {
      console.warn(`No interpretation for number: ${number}`);
      return null;
    }

    return numData[key];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get interpretation: ${error.message}`);
    }
    throw new Error('Failed to get interpretation');
  }
}

export function clearCache(): void {
  cachedNumData = null;
}
