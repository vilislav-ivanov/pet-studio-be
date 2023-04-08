import mongoose, { Document } from 'mongoose';
import { ProductDocument } from './product.model';

export interface FinishedProductDocument extends Document {
  product: ProductDocument['_id'];
  img: string;
  imgs: string[];
  isFinishedByAdmin: boolean;
  isFinishedByClient: boolean;
}

const FinishedProductSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    img: { type: String },
    imgs: [{ type: String, default: [] }],
    isFinishedByAdmin: { type: Boolean, default: false },
    isFinishedByClient: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Modo = mongoose.model('FinishedProduct', FinishedProductSchema);
const FinishedProductModel =
  mongoose.model<FinishedProductDocument>(
    'FinishedProduct',
    FinishedProductSchema
  ) || Modo;

export default FinishedProductModel;
