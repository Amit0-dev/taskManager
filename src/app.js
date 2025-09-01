import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// import routers
import healthCheckRouter from './routes/healthCheck.routes.js';
import userRouter from './routes/user.routes.js';

app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/user', userRouter);

export { app };
