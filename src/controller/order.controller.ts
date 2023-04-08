import { Request, Response } from 'express';
import logger from '../logger';
import { ProductDocument } from '../model/product.model';
import { ShippingAddressDocument } from '../model/shippingAddress.model';
import { emptyCart, getCart } from '../service/cart.service';
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
} from '../service/order.service';
import errorHandler from '../utils/errors/error-handler';

export async function createOrderHandler(
  req: Request<{}, {}, { cartId: string; paymentIntent: string }, {}>,
  res: Response
) {
  try {
    const cart = await getCart(req.body.cartId);

    if (!cart) {
      return res.sendStatus(403);
    }

    let productsContainsOnlyDigital = true;
    cart.products.forEach((product: ProductDocument) => {
      if (product.productType !== 'digital') {
        productsContainsOnlyDigital = false;
      }
    });

    let shippingAddress =
      cart.shippingAddress as ShippingAddressDocument | null;
    let email = cart.shippingAddress?.email as string;

    if (productsContainsOnlyDigital) {
      shippingAddress = null;
      email = cart.address.email;
    }

    const data = {
      products: cart.products as ProductDocument[],
      shippingAddress: shippingAddress,
      price: cart.price,
      email: email,
      paymentIntent: req.body.paymentIntent,
    };
    const order = await createOrder(data);
    await emptyCart(cart._id);
    return res.json({ order });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function getSingleOrderHandler(
  req: Request<{}, {}, {}, { email: string; orderId: string }>,
  res: Response
) {
  const email = req.query.email;
  const orderId = req.query.orderId;

  try {
    const order = await getSingleOrder(email, orderId);
    return res.json({ order });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function getAllOrdersHandler(req: Request, res: Response) {
  try {
    const orders = await getAllOrders();
    return res.json({ orders });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
