import { Collection } from 'mongodb';
import { TransactionInjectableDependencies } from '../diConfig';
import { ITransaction } from '../model/Transaction';
import ITransactionRepository from "./interface";

export default class TransactionMongoRepository implements ITransactionRepository {
  private readonly transactionModel: Collection<ITransaction>;

  constructor({ mongo }: TransactionInjectableDependencies) {
    this.transactionModel = mongo.db(process.env.MONGO_DBNAME).collection<ITransaction>('transactions');
  }

  async findOneById(transaction_id: string) {
    return await this.transactionModel.findOne({ id: transaction_id }) as ITransaction | undefined;
  }

  async findAll(): Promise<ITransaction[] | []> {
    return await this.transactionModel.find().toArray();
  }
}
