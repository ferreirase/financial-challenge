import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../../user/model/User';

export interface IAccount extends Document {
  user: IUser['_id'];
  account_number: string;
  balance: number;
}

const AccountSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Define o relacionamento com o modelo User
  account_number: { type: String, required: true },
  balance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAccount>('Account', AccountSchema);
