import { Request, Response, NextFunction } from 'express';
import { getCart } from '../service/cart.service';

export async function requireCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cartId = req.cookies.csid as string;
  const cart = await getCart(cartId);

  if (cartId && cart) {
    return next();
  }

  return res.sendStatus(403);
}
