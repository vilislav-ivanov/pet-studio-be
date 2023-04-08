import mongoose, { Document } from 'mongoose';

export interface ProductDocument extends Document {
  category: string;
  productType: string;
  location: string;
  photoDestination: string;
  moreInfo: string | null;
  isFinalized: boolean;
  price: number;
  selectedImg: { url: string; filepath: string };
  finishedImgs: { url: string; filepath: string }[];
  isFinishedByAdmin: boolean;
  isFinishedByClient: boolean;
}

const ProductSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    productType: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    photoDestination: { type: String, required: true },
    moreInfo: { type: String },
    isFinalized: { type: Boolean, default: false },
    selectedImg: {
      url: { type: String },
      filepath: { type: String },
    },
    finishedImgs: [
      {
        url: { type: String, required: true },
        filepath: { type: String, required: true },
      },
    ],
    isFinishedByAdmin: { type: Boolean, default: false },
    isFinishedByClient: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;
