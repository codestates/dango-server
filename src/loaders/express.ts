import express, { Application } from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import mylogger from '../middleware/mylogger';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use(mylogger);


export default app;
