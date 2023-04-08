import mongoose, { Document } from 'mongoose';

export interface AddressDocument extends Document {
  email: string;
}

const AddressSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
  },
  { timestamps: true }
);
const Modo = mongoose.model('Address', AddressSchema);
const AddressModel =
  mongoose.model<AddressDocument>('Address', AddressSchema) || Modo;

export default AddressModel;
