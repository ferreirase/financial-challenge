import { IAccount } from "../model/Account";

export default interface IAccountRepository {
  findOneByAccountNumber(account_number: string): Promise<IAccount | undefined>;
  findAll(): Promise<IAccount[] | []>;
}