import { Request, Response, NextFunction } from 'express';
import { DeleteProductInput } from '../controller/product.controller';
import { getCart } from '../service/cart.service';

export async function requireCorrectCookieForProduct(
  req: Request<{}, {}, DeleteProductInput, {}>,
  res: Response,
  next: NextFunction
) {
  let valid = false;
  const productId = req.body.products[0];
  const cartId = req.cookies.csid as string;
  const cart = await getCart(cartId);

  cart?.products.forEach((product) => {
    if (product._id.toString() === productId) {
      valid = true;
    }
  });

  if (!valid) {
    return res.sendStatus(403);
  }

  return next();
}
