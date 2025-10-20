import { Request, Response, NextFunction } from 'express';
import type { NumerologyRequest, NumerologyResponse } from './types';

export interface NumerologyController {
  saveNumerologyResult(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class NumerologyControllerImpl implements NumerologyController {
  async saveNumerologyResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { telegramId, numerologyResult }: NumerologyRequest = req.body;
      
      console.log('Received numerology calculation request:', { 
        telegramId, 
        result: {
          date: numerologyResult.date,
          number: numerologyResult.number,
          isMasterNumber: numerologyResult.isMasterNumber
        }
      });

      // Validate required fields
      if (!telegramId || !numerologyResult) {
        res.status(400).json({ 
          success: false,
          message: "Missing required fields: telegramId and numerologyResult" 
        });
        return;
      }

      // Validate numerology result structure
      if (!numerologyResult.date || 
          typeof numerologyResult.number !== 'number' || 
          typeof numerologyResult.isMasterNumber !== 'boolean') {
        res.status(400).json({ 
          success: false,
          message: "Invalid numerology result format" 
        });
        return;
      }

      // TODO: Process the numerology result
      // For now, just return success
      const response: NumerologyResponse = {
        success: true,
        message: "Numerology result processed successfully"
      };

      console.log('Numerology result processed successfully:', { telegramId });
      res.status(200).json(response);

    } catch (error) {
      console.error('Error processing numerology result:', error);
      next(error);
    }
  }
}
