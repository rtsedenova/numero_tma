import { Request, Response } from 'express';
import { getInterpretationForNumber } from './numerology.service';

interface CalculateRequestBody {
  telegramId: number;
  numerologyResult: {
    date: string;
    number: number;
    isMasterNumber: boolean;
    formula: string;
    steps: string[];
  };
}

export async function calculate(req: Request, res: Response): Promise<void> {
  try {
    console.log('[Numerology] Calculate request received:', req.body);
    
    const { telegramId, numerologyResult } = req.body as CalculateRequestBody;

    // Validate required fields
    if (!telegramId || !numerologyResult) {
      console.log('[Numerology] Validation failed: Missing telegramId or numerologyResult');
      res.status(400).json({
        success: false,
        message: 'Missing required parameters: telegramId and numerologyResult are required',
      });
      return;
    }

    if (!numerologyResult.number || !numerologyResult.date) {
      console.log('[Numerology] Validation failed: Missing number or date');
      res.status(400).json({
        success: false,
        message: 'Missing required fields in numerologyResult: number and date are required',
      });
      return;
    }

    console.log('[Numerology] Fetching interpretation for number:', numerologyResult.number);

    // Get interpretation from S3 data
    const interpretation = await getInterpretationForNumber(
      numerologyResult.number
    );

    console.log('[Numerology] Interpretation fetched:', interpretation);

    if (!interpretation) {
      console.log('[Numerology] No interpretation found');
      res.status(404).json({
        success: false,
        message: `No interpretation found for number ${numerologyResult.number}`,
      });
      return;
    }

    // Return success response with interpretation
    const response = {
      success: true,
      message: 'Numerology calculation completed successfully',
      interpretation,
      predictionsLeft: 2, // You can implement proper tracking later
    };
    
    console.log('[Numerology] Sending response:', response);
    res.json(response);
  } catch (error: unknown) {
    console.error('[Numerology] Error in calculate:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Internal server error';

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}

