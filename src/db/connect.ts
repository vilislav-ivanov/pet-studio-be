import mongoose from 'mongoose';
import config from 'config';
import logger from '../logger';
import FinishedProductModel from '../model/finishedProduct.model';

export default async function () {
  const dbUri = config.get<string>('dbUri');

  try {
    await mongoose.connect(dbUri, { autoIndex: true });
    logger.info(`Database Connect at: ${dbUri}`);
  } catch (err) {
    logger.error('Database Error', err);
    process.exit(1);
  }
}
