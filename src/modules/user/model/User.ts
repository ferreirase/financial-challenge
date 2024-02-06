import bcrypt from 'bcryptjs';
import mongoose, { CallbackError, Document, Schema } from 'mongoose';

enum UserType {
  PJ = 1,
  PF = 2,
};

export interface IUser extends Document {
  type: UserType;
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  type: { type: UserType, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre<IUser>('save', async function(next: mongoose.CallbackWithoutResultAndOptionalError) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    next();
  } catch (error: unknown) {
    next(error as CallbackError | undefined);
  }
});

export default mongoose.model<IUser>('User', UserSchema);
