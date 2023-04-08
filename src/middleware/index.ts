import { Express } from 'express';
import deserializeUser from './deserializeUser';

function connectMiddlewares(app: Express) {
  app.use(deserializeUser);
}

export default connectMiddlewares;
