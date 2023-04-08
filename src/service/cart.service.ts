import { Types } from 'mongoose';
import { AddressDocument } from '../model/address.model';

import Cart, { CartDocument } from '../model/cart.model';
import { ProductDocument } from '../model/product.model';
import { ShippingAddressDocument } from '../model/shippingAddress.model';
import { NotFoundError } from '../utils/errors/errors';

export async function getCart(cartId: string) {
  const cart = await Cart.findOne({ _id: cartId }).populate([
    'products',
    'shippingAddress',
    'address',
  ]);
  return cart;
}

export async function addProductToCart(
  cart: CartDocument & { _id: Types.ObjectId },
  product: ProductDocument & {
    _id: Types.ObjectId;
  }
) {
  cart.products.push(product);
  cart.price += product.price;
  return await cart.save();
}

export async function addShippingAddressToCart(
  cart: CartDocument & { _id: Types.ObjectId },
  shippingAddress: ShippingAddressDocument & {
    _id: Types.ObjectId;
  }
) {
  cart.shippingAddress = shippingAddress;
  cart.save();
  return cart;
}

export async function addAddressToCart(
  cart: CartDocument & { _id: Types.ObjectId },
  address: AddressDocument & {
    _id: Types.ObjectId;
  }
) {
  cart.address = address;
  cart.save();
  return cart;
}

export async function createCart() {
  return await Cart.create({
    products: [],
    shippingAddress: null,
    price: 0,
    address: null,
  });
}

export async function deleteProductInCart(productId: string) {
  const records = await Cart.find({ products: { $in: productId } });
  const record = records[0];

  await Cart.updateOne(
    { _id: record._id },
    { $pull: { products: { $in: [productId] } } }
  );
}

export async function updateCartTotalPrice(
  productId: string,
  productPrice: number
) {
  const records = await Cart.find({ products: { $in: productId } });
  const record = records[0];

  await Cart.updateOne({ _id: record._id }, { $inc: { price: -productPrice } });
}

export async function emptyCart(cartId: string) {
  const cart = await getCart(cartId);

  if (!cart) {
    throw new NotFoundError('cart not found');
  }
  cart.products = [];
  cart.shippingAddress = null;
  cart.address = null;
  cart.price = 0;

  await cart.save();
}
