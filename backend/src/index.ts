import express from 'express';
import cors from 'cors';
import transactionsRouter from './routes/transactions';
import blocksRouter from './routes/blocks';
import statsRouter from './routes/stats';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(transactionsRouter);
app.use(blocksRouter);
app.use(statsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const serverStartTime = Date.now();
