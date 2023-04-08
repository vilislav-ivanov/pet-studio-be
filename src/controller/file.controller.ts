import { Request, Response } from 'express';
import logger from '../logger';
import { generateUrl } from '../service/file.service';
import errorHandler from '../utils/errors/error-handler';

export async function getSignedUrlHandler(
  req: Request<{}, {}, {}, { filename: string; path: string }>,
  res: Response
) {
  const { filename, path } = req.query;

  try {
    const urls = await generateUrl(filename, path);
    res.send({ urls });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
