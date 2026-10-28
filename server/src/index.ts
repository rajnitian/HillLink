import express from 'express';
import cors from 'cors';
import requestsRouter from './routes/requests.js';
import donorsRouter from './routes/donors.js';
import notificationsRouter from './routes/notifications.js';

const app = express();
const port = Number(process.env.PORT || 4000);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', mode: 'demo' }));
app.use('/api/requests', requestsRouter);
app.use('/api/donors', donorsRouter);
app.use('/api/notifications', notificationsRouter);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.listen(port, () => console.log(`HillLink demo API listening at http://localhost:${port}`));
