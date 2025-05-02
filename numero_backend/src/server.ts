import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import s3Routes from './routes/s3.routes';
import userRoutes from './routes/users.routes';
import predictionRoutes from './routes/predictions.routes';

dotenv.config();

const app = express();
const PORT = 443;

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/numero-tma-server.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/numero-tma-server.com/fullchain.pem'),
};

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is working with HTTPS!');
});

app.use('/api/s3', s3Routes);
app.use('/api/db', userRoutes);
app.use('/api/db', predictionRoutes);

app.use(errorHandler);

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS сервер запущен на https://numero-tma-server.com`);
});
