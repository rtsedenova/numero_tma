import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from '../middlewares/errorHandler';
import { initPaymentModule } from '../features/payment';
import tarotRoutes from '../features/tarot/tarot.routes';
import { numerologyRoutes } from '../features/numerology';
import { initUsersModule } from '../features/users';
import { initS3Module } from '../features/s3';

export function createServer() {
  const app = express();

  app.options('*', cors());

  app.use(cors({ origin: '*' }));
  app.use(cors({
    origin: [
      /^https:\/\/(\w+\.)?t\.me$/,           
      /^https:\/\/web\.telegram\.org$/,    
    ],
    credentials: false, 
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  }));

  const corsForTMA = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin ?? '';
    const allowed = /^(https:\/\/(numero-tma\.com|www\.numero-tma\.com|web\.telegram\.org|t\.me))$/i.test(origin);
    if (allowed) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,Origin,X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204); 
      return;              
    }
    next();
  };

  app.use(corsForTMA);
  
  app.use(express.json());

  app.get('/', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.send(`Server is working on ${isProduction ? 'HTTPS (prod)' : 'HTTP (dev)'}!`);
  });

  app.get('/api/health', (_req, res) => {
    console.log('HEALTH', new Date().toISOString());
    res.json({ ok: true, t: Date.now() });
  });

  // Feature routes
  app.use('/api/numerology', numerologyRoutes);
  app.use('/api/tarot', tarotRoutes);
  
  // Initialize feature modules
  initS3Module(app);
  initUsersModule(app);
  initPaymentModule(app);
  
  app.use(errorHandler);

  return app;
}
