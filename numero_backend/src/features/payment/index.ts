import { type Express } from 'express';
import paymentRoutes from './payment.routes';

export const initPaymentModule = (app: Express) => {
  app.use('/api/payment', paymentRoutes);
};

export { PaymentController } from './payment.controller';
export { TelegramStarsService } from './payment.service';

