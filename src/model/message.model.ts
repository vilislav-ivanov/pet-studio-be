import mongoose, { Document } from 'mongoose';

export interface MessageDocument extends Document {
  email: string;
  subject: string;
  message: string;
  answered: boolean;
}

const MessageSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    answered: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Modo = mongoose.model('Message', MessageSchema);
const MessageModel =
  mongoose.model<MessageDocument>('Message', MessageSchema) || Modo;

export default MessageModel;
