import express from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import logger from './logger';
import connect from './db/connect';
import connectRoutes from './routes';
import connectMiddlewares from './middleware';

const port = config.get<number>('port');
const host = config.get<string>('host');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    exposedHeaders: ['Authorization', 'x-access-token', 'Set-Cookie'],
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();

  // res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Access-Control-Allow-Origin', req.headers.origin);
  // res.header(
  //   'Access-Control-Allow-Methods',
  //   'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
  // );
  // res.header(
  //   'Access-Control-Allow-Headers',
  //   'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  // );
  // next();
});

app.listen(port, host, async () => {
  await connect();
  connectMiddlewares(app);
  connectRoutes(app);
  logger.info(`App up and running at http://${host}:${port}`);
});
