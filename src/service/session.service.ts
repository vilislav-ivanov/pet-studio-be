import {
  FilterQuery,
  LeanDocument,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import config from 'config';
import { get, omit } from 'lodash';
import SessionModel, { SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';
import { decode, sign } from '../utils/jwt.utils';
import { findUser } from './user.service';
import { ExecutionError, NotFoundError } from '../utils/errors/errors';

export function createSession(userId: string, userAgent: string | undefined) {
  try {
    return SessionModel.create({
      user: userId,
      userAgent,
    });
  } catch (error: any) {
    throw new ExecutionError(error.message);
  }
}

export function createAccessToken(
  session: SessionDocument | LeanDocument<SessionDocument>,
  user: UserDocument | LeanDocument<Omit<UserDocument, 'password'>>
) {
  const accessToken = sign(
    { ...omit(user, 'password'), session: session._id },
    { expiresIn: config.get<string>('accessTokenTtl') }
  );
  return accessToken;
}

export function createRefreshToken(sessionId: string) {
  const refreshToken = sign(
    { session: sessionId },
    { expiresIn: config.get<string>('refreshTokenTtl') }
  );
  return refreshToken;
}

export async function reIssueAccessToken(refreshToken: string) {
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, 'session')) return false;

  const session = await SessionModel.findById(get(decoded, 'session'));

  if (!session || !session?.isValid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken(
    session,
    user.toObject({ flattenMaps: true })
  );

  return accessToken;
}

export async function updateSession(
  filter?: FilterQuery<SessionDocument> | undefined,
  update?:
    | UpdateWithAggregationPipeline
    | UpdateQuery<SessionDocument>
    | undefined
) {
  const session = await SessionModel.updateOne(filter, update);

  if (!session) {
    throw new NotFoundError('session not found.');
  }
  return session;
}
