import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../service/user.service';
import logger from '../logger';
import errorHandler from '../utils/errors/error-handler';

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput, {}>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    res.status(200).send(omit(user?.toJSON(), 'password'));
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function getUserHandler(req: Request, res: Response) {
  //@ts-ignore
  const user = req.user;
  res.json({ user });
}
