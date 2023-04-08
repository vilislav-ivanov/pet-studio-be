import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import logger from '../logger';
import { reIssueAccessToken } from '../service/session.service';
import { decode } from '../utils/jwt.utils';

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '');
  const refreshToken = get(req, 'headers.x-refresh') as string;

  if (!accessToken) return next();

  const { expired, decoded } = decode(accessToken);
  if (decoded) {
    // @ts-ignore
    req.user = decoded;
  } else if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);

      const { decoded } = decode(newAccessToken);

      //@ts-ignore
      req.user = decoded;
    }
    return next();
  }
  return next();
}

export default deserializeUser;
