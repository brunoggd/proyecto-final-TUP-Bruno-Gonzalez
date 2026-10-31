import express from 'express';
import cors from 'cors';
import routes from './routes';
import { notFound, errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.get('/health', (_req, res) => {
    res.json({status: 'ok'});
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;