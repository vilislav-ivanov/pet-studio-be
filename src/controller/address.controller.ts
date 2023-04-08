import { Request, Response } from 'express';
import logger from '../logger';
import { addAddressToCart, getCart } from '../service/cart.service';
import { createAddress, updateAddress } from '../service/address.service';
import errorHandler from '../utils/errors/error-handler';

export interface CreateAddressInput {
  email: string;
}

export async function createAddressHandler(
  req: Request<{}, {}, CreateAddressInput, {}>,
  res: Response
) {
  try {
    const cartId = req.cookies.csid as string;
    const address = await createAddress(req.body);
    let cart = await getCart(cartId);

    if (!cart) {
      return res.sendStatus(403);
    }

    cart = await addAddressToCart(cart, address);
    res.status(200).json({ cart });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function editAddressHandler(
  req: Request<{ addressId: string }, {}, CreateAddressInput, {}>,
  res: Response
) {
  try {
    const addressId = req.params.addressId;
    const updatedAddress = await updateAddress(addressId, req.body);

    res.status(200).json({ address: updatedAddress });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
