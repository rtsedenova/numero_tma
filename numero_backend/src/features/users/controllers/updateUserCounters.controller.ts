import { Request, Response, NextFunction } from 'express';
import {
updateUserPredictions,
setNumerologyFreePredictionsLeft,
setTarotFreePredictionsLeft,
setCredits,
} from '../services/updateUserCounters.service';
import { QueryResult } from 'pg';

type UpdateOperation = {
value: number | undefined;
service: (telegramId: string, value: number) => Promise<QueryResult>;
fieldName: string;
};

const validateNonNegativeNumber = (
value: unknown,
fieldName: string,
): value is number => {
return (
    typeof value === 'number' && !isNaN(value) && value >= 0
);
};

const handleUpdateOperation = async (
telegramId: string,
operation: UpdateOperation,
): Promise<QueryResult | null> => {
if (operation.value === undefined) {
    return null;
}

if (!validateNonNegativeNumber(operation.value, operation.fieldName)) {
    throw new Error(`Incorrect ${operation.fieldName} value`);
}

const result = await operation.service(telegramId, operation.value);

if (result.rowCount === 0) {
    throw new Error('User not found');
}

return result;
};

export const updatePredictionsController = async (
req: Request,
res: Response,
next: NextFunction,
): Promise<void> => {
try {
    const {
    telegramId,
    predictionsLeft,
    numerologyFreePredictionsLeft,
    tarotFreePredictionsLeft,
    credits,
    } = req.body;

    console.log('[UserCounters] Update request received', {
    telegramId,
    predictionsLeft,
    numerologyFreePredictionsLeft,
    tarotFreePredictionsLeft,
    credits,
    });

    if (!telegramId) {
    console.log('[UserCounters] Invalid data: missing telegramId');
    res
        .status(400)
        .json({ message: 'Incorrect data: telegramId is required' });
    return;
    }

    const hasLegacyField = predictionsLeft !== undefined;
    const hasNewFields =
    numerologyFreePredictionsLeft !== undefined ||
    tarotFreePredictionsLeft !== undefined ||
    credits !== undefined;

    if (!hasLegacyField && !hasNewFields) {
    console.log('[UserCounters] Invalid data: no fields to update', {
        telegramId,
    });
    res.status(400).json({
        message: 'Incorrect data: at least one field must be provided',
    });
    return;
    }

    if (hasLegacyField) {
    if (!validateNonNegativeNumber(predictionsLeft, 'predictionsLeft')) {
        console.log('[UserCounters] Invalid predictions count', {
        predictionsLeft,
        type: typeof predictionsLeft,
        });
        res.status(400).json({ message: 'Incorrect predictions count' });
        return;
    }

    const result = await updateUserPredictions(telegramId, predictionsLeft);

    if (result.rowCount === 0) {
        console.log('[UserCounters] User not found (legacy update)', {
        telegramId,
        });
        res.status(404).json({ message: 'User not found' });
        return;
    }

    console.log('[UserCounters] Update successful (legacy)', {
        telegramId,
        predictionsLeft,
    });

    res
        .status(200)
        .json({ message: 'Successfully updated', user: result.rows[0] });
    return;
    }

    const updateOperations: UpdateOperation[] = [
    {
        value: numerologyFreePredictionsLeft,
        service: setNumerologyFreePredictionsLeft,
        fieldName: 'numerologyFreePredictionsLeft',
    },
    {
        value: tarotFreePredictionsLeft,
        service: setTarotFreePredictionsLeft,
        fieldName: 'tarotFreePredictionsLeft',
    },
    {
        value: credits,
        service: setCredits,
        fieldName: 'credits',
    },
    ];

    let lastResult: QueryResult | null = null;

    for (const operation of updateOperations) {
    try {
        const result = await handleUpdateOperation(telegramId, operation);
        if (result) {
        lastResult = result;
        }
    } catch (error) {
        const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage === 'User not found') {
        console.log(`[UserCounters] User not found (${operation.fieldName})`, {
            telegramId,
        });
        res.status(404).json({ message: 'User not found' });
        return;
        }

        res.status(400).json({ message: errorMessage });
        return;
    }
    }

    if (lastResult && lastResult.rows.length > 0) {
    console.log('[UserCounters] Update successful', {
        telegramId,
        numerologyFreePredictionsLeft,
        tarotFreePredictionsLeft,
        credits,
    });

    res
        .status(200)
        .json({ message: 'Successfully updated', user: lastResult.rows[0] });
    return;
    }

    console.error('[UserCounters] Update failed with no result', {
    telegramId,
    });
    res.status(500).json({ message: 'Update failed' });
} catch (error) {
    console.error('[UserCounters] Error updating counters', { error });
    next(error);
}
};

