import mongoose, { Document } from 'mongoose';
import { FinishedProductDocument } from './finishedProduct.model';
import { ProductDocument } from './product.model';
import { ShippingAddressDocument } from './shippingAddress.model';

export interface OrderDocument extends Document {
  products: ProductDocument['_id'][];
  shippingAddress: ShippingAddressDocument['_id'] | null;
  email: string;
  price: number;
  completed: boolean;
  paymentIntent: string;
  publicId: string;
  finishedProducts: FinishedProductDocument['_id'][];
  // digitalProduct: DigitalProduct['_id'];
  isFinishedByAdmin: boolean;
  isFinishedByClient: boolean;
}

const OrderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingAddress',
      default: null,
    },
    paymentIntent: { type: String, required: true, unique: true },
    publicId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    price: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    finishedProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'FinishedProduct' },
    ],
    isFinishedByAdmin: { type: Boolean, default: false },
    isFinishedByClient: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);

export default OrderModel;
