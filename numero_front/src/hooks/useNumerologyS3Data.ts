import { useState, useCallback } from 'react';
import { api, API_ENDPOINTS } from '@/config/api';
import type { DestinyNumberData, DestinyNumberResponse } from '@/types/destiny';

interface UseNumerologyS3DataReturn {
  data: DestinyNumberData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (number: number) => Promise<void>;
}

export const useNumerologyS3Data = (): UseNumerologyS3DataReturn => {
  const [data, setData] = useState<DestinyNumberData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<DestinyNumberResponse | null>(null);

  const fetchData = useCallback(async (number: number): Promise<void> => {
    if (allData) {
      // If we already have the data, just extract the specific number
      const numberData = allData[number] || allData[parseInt(number.toString().slice(0, 1))];
      setData(numberData || null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching numerology data from S3 for number:', number);
      
      const { data: responseData } = await api.get<DestinyNumberResponse>(API_ENDPOINTS.s3.numData);
      
      setAllData(responseData);
      
      // Extract data for the specific number
      const numberData = responseData[number] || responseData[parseInt(number.toString().slice(0, 1))];
      setData(numberData || null);

      console.log('Numerology data fetched successfully:', numberData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch numerology data';
      console.error('Error fetching numerology data:', err);
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [allData]);

  return {
    data,
    isLoading,
    error,
    fetchData
  };
};
