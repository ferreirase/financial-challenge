import mongoose, { Document, Schema } from 'mongoose';
import { IAccount } from '../../account/model/Account';

export interface ITransaction extends Document {
  sender: IAccount['_id'];
  receiver: IAccount['_id'];
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

const TransactionSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
