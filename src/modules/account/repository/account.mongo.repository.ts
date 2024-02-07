import { Collection } from 'mongodb';
import { AccountInjectableDependencies } from '../diConfig';
import { IAccount } from '../model/Account';
import IAccountRepository from "./interface";

export default class AccountMongoRepository implements IAccountRepository {
  private readonly accountModel: Collection<IAccount>;

  constructor({ mongo }: AccountInjectableDependencies) {
    this.accountModel = mongo.db(process.env.MONGO_DBNAME).collection<IAccount>('accounts');
  }

  async findOneByAccountNumber(account_number: string) {
    return await this.accountModel.findOne({ account_number }) as IAccount | undefined;
  }

  async findAll(): Promise<IAccount[] | []> {
    return await this.accountModel.find().toArray();
  }

  updateBalance(account_number: string, new_balance: number): void {
    this.accountModel.findOneAndUpdate({ account_number }, { 
      $set: { balance: new_balance }
    });
  }
}
