import { IAccount } from "../../account/model/Account";
import { TransactionInjectableDependencies } from '../diConfig';
import Transaction, { ITransaction } from '../model/Transaction';
import ITransactionRepository from "./interface";

export default class TransactionMongoRepository implements ITransactionRepository {
  private readonly transactionModelConnection;

  constructor({ mongooseConnection }: TransactionInjectableDependencies) {
    // this.transactionModel = mongo.db(process.env.MONGO_DBNAME).collection<ITransaction>('transactions');
    this.transactionModelConnection = mongooseConnection;
  }

  async findOneById(transaction_id: string) {
    return await Transaction.findOne({ id: transaction_id });
  }

  async findAll(): Promise<ITransaction[] | []> {
    return await Transaction.find();
  }
  
  async create(senderAccount: IAccount, receiverAccount: IAccount, amount: number, status: string) {
    this.transactionModelConnection.once('connected', () => {
      console.log('MONGO CONECTADO!');
    });

    const transactionCreated = await Transaction.create([
      {
        sender: senderAccount, 
        receiver: receiverAccount,
        amount,
        status,
      }
    ]);

    return JSON.parse(JSON.stringify(transactionCreated));
  }
}
