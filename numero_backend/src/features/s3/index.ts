import { type Express } from 'express';
import s3Router from './routes/s3.routes';

export const initS3Module = (app: Express) => {
  app.use("/api/s3", s3Router);
};

