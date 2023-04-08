import mongoose, { Document } from 'mongoose';
import { UserDocument } from './user.model';

export interface SessionDocument extends Document {
  user: UserDocument['_id'];
  isValid: boolean;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isValid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema);

export default SessionModel;
