import { Request, Response } from 'express';
import logger from '../logger';
import { createCart, getCart } from '../service/cart.service';
import errorHandler from '../utils/errors/error-handler';

export async function getCartHandler(req: Request, res: Response) {
  try {
    const cart = await getCart(req.cookies.csid);
    if (!cart) {
      const newCart = await createCart();
      return res.json({ cart: newCart });
    }
    return res.json({ cart });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
