import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import s3Routes from './routes/s3Routes';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api', s3Routes);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
