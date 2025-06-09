import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import http from 'http';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import s3Routes from './routes/s3.routes';
import userRoutes from './routes/users.routes';
import predictionRoutes from './routes/predictions.routes';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const HTTPS_PORT = 443;
const HTTP_PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Server is working on ${isProduction ? 'HTTPS (prod)' : 'HTTP (dev)'}!`);
});

app.use('/api/s3', s3Routes);
app.use('/api/db/users', userRoutes);
app.use('/api/db/predictions', predictionRoutes);

app.use(errorHandler);

if (isProduction) {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/numero-tma-server.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/numero-tma-server.com/fullchain.pem'),
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS сервер запущен на https://numero-tma-server.com`);
  });
} else {
  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP сервер запущен на http://localhost:${HTTP_PORT}`);
  });
}
