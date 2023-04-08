import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

function validateRequest(schema: AnySchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
        return res.status(400).send(err.message);
      }
    }
  };
}

export default validateRequest;
