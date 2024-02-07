import { InsertOneResult } from "mongodb";
import { AnyObject, Document, ObjectId } from 'mongoose';
import { IAccount } from "../../account/model/Account";
import { ITransaction } from "../model/Transaction";

export default interface ITransactionRepository {
  findOneById(transaction_id: string): Promise<(Document<unknown, {}, ITransaction> & ITransaction & { _id: ObjectId; }) | null>;
  create(senderAccount: IAccount, receiverAccount: IAccount, amount: number, status: string): Promise<InsertOneResult<AnyObject>>;
  findAll(): Promise<ITransaction[] | []>;
}
