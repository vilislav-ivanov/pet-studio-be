import jwt from 'jsonwebtoken';
import config from 'config';
import { ExecutionError } from './errors/errors';

const secret = config.get<string>('jsonWebTokenSecretOrPrivateKey');

export function sign(obj: Object, options?: jwt.SignOptions | undefined) {
  try {
    return jwt.sign(obj, secret, options);
  } catch (error) {
    if (error instanceof Error) {
      throw new ExecutionError(error.message);
    }
  }
}

export function decode(token: string) {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error instanceof Error ? error.message === 'jwt expired' : '',
      decoded: null,
    };
  }
}
