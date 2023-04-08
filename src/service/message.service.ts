import MessageModel from '../model/message.model';
import { NotFoundError } from '../utils/errors/errors';

export async function createMessage(
  email: string,
  subject: string,
  message: string
) {
  return await MessageModel.create({ email, subject, message });
}

export async function getAllMessages(answered: boolean) {
  return await MessageModel.find({ answered: answered });
}

export async function getMessage(id: string) {
  const message = await MessageModel.findOne({ _id: id });

  if (!message) {
    throw new NotFoundError('Message not found');
  }

  return message;
}
