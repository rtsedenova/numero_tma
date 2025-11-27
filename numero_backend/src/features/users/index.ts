import { type Express } from 'express';
import usersRouter from './routes/users.routes';
import predictionsRouter from './routes/predictions.routes';

export const initUsersModule = (app: Express) => {
  app.use("/api/db/users", usersRouter);
  app.use("/api/db/predictions", predictionsRouter);
};

