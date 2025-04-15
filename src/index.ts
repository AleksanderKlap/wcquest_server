import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { json } from 'stream/consumers';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the WC Quest Server!' });
});

// Health endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});