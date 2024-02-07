import { Types } from "mongoose";
import { IAccount } from "../model/Account";

export default interface IAccountRepository {
  findOneByAccountNumber(account_number: string): Promise<IAccount | undefined>;
  findAll(): Promise<IAccount[] | []>;
  updateBalance(account_number: string, new_balance: number): void;
  findOneByAccountId(account_id: Types.ObjectId): Promise<IAccount | undefined>;
}
