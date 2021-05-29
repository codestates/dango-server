import express, { Application } from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import mylogger from '../API/middleware/mylogger';
import config from '../config/key';

export default ({ app }: { app: Application }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieparser());
  app.use(
    cors({
      origin: config.clientURL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );

  app.use(mylogger);
};
