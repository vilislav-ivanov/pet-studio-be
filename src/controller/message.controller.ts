import { Request, Response } from 'express';
import logger from '../logger';
import {
  createMessage,
  getAllMessages,
  getMessage,
} from '../service/message.service';
import errorHandler from '../utils/errors/error-handler';

export async function createMessageHandler(
  req: Request<{}, {}, { email: string; subject: string; message: string }>,
  res: Response
) {
  try {
    const message = await createMessage(
      req.body.email,
      req.body.subject,
      req.body.message
    );
    return res.json({ message });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function getAllMessagesHandler(
  req: Request<{}, {}, {}, { answered?: boolean | null }>,
  res: Response
) {
  const answered = req.query.answered || false;
  try {
    const messages = await getAllMessages(answered);
    return res.json({ messages });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function getMessageHandler(
  req: Request<{ messageId: string }>,
  res: Response
) {
  try {
    const messageId = req.params.messageId;
    const message = await getMessage(messageId);
    return res.json({ message });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
