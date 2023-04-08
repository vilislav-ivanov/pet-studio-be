import { Request, Response } from 'express';
import { getUser } from '../service/user.service';
import { get } from 'lodash';
import {
  createSession,
  createAccessToken,
  createRefreshToken,
  updateSession,
} from '../service/session.service';
import logger from '../logger';
import errorHandler from '../utils/errors/error-handler';

interface CreateSessionInput {
  email: string;
  password: string;
}

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput, {}>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const userAgent = req.get('user-agent');

    const user = await getUser(email, password);

    const session = await createSession(user._id, userAgent);

    const accessToken = createAccessToken(
      session,
      user.toObject({ flattenMaps: true })
    );
    const refreshToken = createRefreshToken(session._id);

    return res.status(200).send({ accessToken, refreshToken });
  } catch (error: any) {
    logger.error(error.message);
    errorHandler(error, res);
  }
}

export async function invalidateSessionHandler(req: Request, res: Response) {
  const sessionId = get(req, 'user.session');

  await updateSession({ _id: sessionId }, { isValid: false });

  return res.sendStatus(200);
}
