import { CreateTransactionDTO } from '../dtos';
import { ITransaction } from "../model/Transaction";

export default interface ITransactionRepository {
  findOneById(transaction_id: string): Promise<ITransaction | undefined>;
  create(data: CreateTransactionDTO): ITransaction;
  findAll(): Promise<ITransaction[] | []>;
}
