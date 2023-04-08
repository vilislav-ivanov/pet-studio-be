import { Request, Response } from 'express';
import logger from '../logger';
import { addShippingAddressToCart, getCart } from '../service/cart.service';
import {
  createShippingAddress,
  updateShippingAddress,
} from '../service/shippingAddress.service';
import errorHandler from '../utils/errors/error-handler';

export interface CreateShippingAddressInput {
  firstName: string;
  lastName: string;
  email: string;
  addressLine: string;
  city: string;
  province: string;
  country: string;
  zipOrPostalCode: string;
}

export async function createShippingAddressHandler(
  req: Request<{}, {}, CreateShippingAddressInput, {}>,
  res: Response
) {
  try {
    const cartId = req.cookies.csid as string;
    const shippingAddress = await createShippingAddress(req.body);
    let cart = await getCart(cartId);

    if (!cart) {
      return res.sendStatus(403);
    }

    cart = await addShippingAddressToCart(cart, shippingAddress);
    res.status(200).json({ cart });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function editShippingAddressHandler(
  req: Request<{ shippingId: string }, {}, CreateShippingAddressInput, {}>,
  res: Response
) {
  try {
    const shippingId = req.params.shippingId;
    const updatedShippingAddress = await updateShippingAddress(
      shippingId,
      req.body
    );

    res.status(200).json({ shippingAddress: updatedShippingAddress });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
