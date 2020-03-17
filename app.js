import express, { json, urlencoded, static as staticPath } from 'express';
import logger from 'morgan';
import cors from 'cors';

import authRoute from './app/routes/auth';
import userRoute from './app/routes/user';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', staticPath('uploads'));
app.use('/v1/auth/', authRoute);
app.use('/v1/users/', userRoute);

export default app;
