import mongoose, { Document } from 'mongoose';

export interface ShippingAddressDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  addressLine: string;
  city: string;
  province: string;
  country: string;
  zipOrPostalCode: string;
}

const ShippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    zipOrPostalCode: { type: String, required: true },
  },
  { timestamps: true }
);

const ShippingAddressModel = mongoose.model<ShippingAddressDocument>(
  'ShippingAddress',
  ShippingAddressSchema
);

export default ShippingAddressModel;
