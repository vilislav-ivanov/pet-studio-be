import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre(
  'save',
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    const user = this;

    if (!user.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    return next();
  }
);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password);
};

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
