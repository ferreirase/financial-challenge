import { Collection } from 'mongodb';
import { Types } from "mongoose";
import { AccountInjectableDependencies } from '../diConfig';
import { IAccount } from '../model/Account';
import IAccountRepository from "./interface";

export default class AccountMongoRepository implements IAccountRepository {
  private readonly accountModel: Collection<IAccount>;

  constructor({ mongo }: AccountInjectableDependencies) {
    this.accountModel = mongo.db(process.env.MONGO_DBNAME).collection<IAccount>('accounts');
  }

  async findOneByAccountNumber(account_number: string) {
    return await this.accountModel.aggregate([
      { $match: { account_number } }, // Filtro para encontrar a conta com o número de conta específico
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } }, // Join com a coleção de usuários
      { $unwind: '$user' }, // Desconstruir o array resultante do join
      { $project: { _id: 1, account_number: 1, balance: 1, 'user.type': 1 } }, // Projeção para incluir apenas os campos desejados
    ]).next()  as IAccount | undefined;
  }

  async findOneByAccountId(account_id: Types.ObjectId) {
    return await this.accountModel.findOne({ _id: account_id }) as IAccount;
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
