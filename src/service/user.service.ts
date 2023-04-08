import { DocumentDefinition, FilterQuery } from 'mongoose';
import User, { UserDocument } from '../model/user.model';
import UserModel from '../model/user.model';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors/errors';

export async function createUser(
  user: DocumentDefinition<
    Omit<UserDocument, 'comparePassword' | 'createdAt' | 'updatedAt'>
  >
) {
  try {
    return await User.create(user);
  } catch (err) {
    if (err instanceof Error) {
      const statusCode = err.message.split(' ')[0] as string;
      if (statusCode === 'E11000') {
        throw new ConflictError('email is alredy in use.');
      }
    }
  }
}

export async function getUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || user === undefined) {
    throw new NotFoundError('user not found.');
  }
  if (!(await user.comparePassword(password))) {
    throw new UnauthorizedError('user password is incorrect.');
  }
  return user;
}

export async function findUser(filter?: FilterQuery<UserDocument>) {
  if (filter) {
    const user = await UserModel.findOne(filter);
    if (!user) {
      throw new NotFoundError('user not found.');
    }
    return user;
  } else return null;
}
