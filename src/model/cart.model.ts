import mongoose, { Document } from 'mongoose';
import { AddressDocument } from './address.model';
import { ProductDocument } from './product.model';
import { ShippingAddressDocument } from './shippingAddress.model';

export interface CartDocument extends Document {
  products: ProductDocument['_id'][];
  shippingAddress: ShippingAddressDocument['_id'] | null;
  address: AddressDocument['_id'] | null;
  email: string | null;
  price: number;
  completed: boolean;
}

const CartSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingAddress',
      default: null,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      default: null,
    },
    price: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<CartDocument>('Cart', CartSchema);

export default CartModel;
