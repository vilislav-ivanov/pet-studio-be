import {
  ValidationError,
  ExecutionError,
  NotFoundError,
  GenericError,
  UnauthorizedError,
  ConflictError,
} from './errors';
import { Response } from 'express';

export default async function _errorHandler(err: Error, res: Response) {
  if (err instanceof NotFoundError) {
    res.status(404).json(err);
    return;
  }
  if (err instanceof ValidationError) {
    res.status(400).json(err);
    return;
  }
  if (err instanceof UnauthorizedError) {
    res.status(401).json(err);
    return;
  }
  if (err instanceof ConflictError) {
    res.status(409).json(err);
    return;
  }
  if (err instanceof ExecutionError) {
    res.status(500).json(err);
    return;
  }
  res.status(500).json(new GenericError('Oops!'));
  return;
}
