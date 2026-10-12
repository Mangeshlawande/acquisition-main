import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import { optionalAuthenticate } from '#middleware/auth.middleware.js';
import securityMiddleware from '#middleware/security.middleware.js';
import usersRoutes from '#routes/user.routes.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet()); //
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.use(optionalAuthenticate);
app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions!');

  res.status(200).send('Hello from Acquisitions!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler — keeps every failure path from hanging the request
app.use((err, req, res, _next) => {
  logger.error(`Unhandled error: ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
  });
});

export default app;
