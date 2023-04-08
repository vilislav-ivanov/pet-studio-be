import OrderModel from '../model/order.model';
import ProductModel, { ProductDocument } from '../model/product.model';
import ShippingAddressModel, {
  ShippingAddressDocument,
} from '../model/shippingAddress.model';
import { ConflictError, NotFoundError } from '../utils/errors/errors';
import shortId from 'shortid';
import FinishedProductModel from '../model/finishedProduct.model';
import { orderCofirmEmail } from './email.service';

export async function createOrder({
  products,
  shippingAddress,
  email,
  price,
  paymentIntent,
}: {
  products: ProductDocument[];
  shippingAddress: ShippingAddressDocument | null;
  email: string;
  price: number;
  paymentIntent: string;
}) {
  try {
    const publicId = shortId.generate();
    const alreadyExistOrderWithPublicId = await OrderModel.findOne({
      publicId: publicId,
    });
    if (alreadyExistOrderWithPublicId) {
      createOrder({
        products,
        shippingAddress,
        email: email,
        price,
        paymentIntent,
      });
    } else {
      const order = await OrderModel.create({
        products: products,
        email: email,
        shippingAddress: shippingAddress,
        price: price,
        paymentIntent,
        publicId,
        finishedProducts: [],
      });

      await orderCofirmEmail(
        email,
        order.publicId,
        shippingAddress?.firstName,
        shippingAddress?.lastName
      );

      return order;
    }
  } catch (err) {
    if (err instanceof Error) {
      const statusCode = err.message.split(' ')[0] as string;
      if (statusCode === 'E11000') {
        throw new ConflictError('paymentIntent is alredy in use.');
      }
    }
  }
}

export async function getSingleOrder(email: string, orderId: string) {
  const order = await OrderModel.findOne({
    email: email,
    publicId: orderId,
  }).populate([
    { path: 'products', model: ProductModel },
    { path: 'shippingAddress', model: ShippingAddressModel },
    { path: 'finishedProducts', model: FinishedProductModel },
  ]);

  if (!order || order === undefined) {
    throw new NotFoundError('order not found.');
  }

  return order;
}

export async function getAllOrders() {
  const orders = await OrderModel.find({}).populate([
    { path: 'products', model: ProductModel },
    { path: 'shippingAddress', model: ShippingAddressModel },
    { path: 'finishedProducts', model: FinishedProductModel },
  ]);

  return orders;
}
