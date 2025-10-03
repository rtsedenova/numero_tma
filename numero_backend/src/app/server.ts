import express from 'express';
import cors from 'cors';
import { errorHandler } from '../middlewares/errorHandler';
import s3Routes from '../routes/s3.routes';
import userRoutes from '../routes/users.routes';
import predictionRoutes from '../routes/predictions.routes';
import paymentRoutes from '../routes/payment.routes';

export function buildApp() {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json());

  app.get('/', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.send(`Server is working on ${isProduction ? 'HTTPS (prod)' : 'HTTP (dev)'}!`);
  });

  app.use('/api/s3', s3Routes);
  app.use('/api/db/users', userRoutes);
  app.use('/api/db/predictions', predictionRoutes);
  app.use('/api/payment', paymentRoutes);

  app.use(errorHandler);

  return app;
}
