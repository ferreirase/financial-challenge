import { ITransaction } from "../model/Transaction";

export default interface ITransactionRepository {
  findOneById(transaction_id: string): Promise<ITransaction | undefined>;
  findAll(): Promise<ITransaction[] | []>;
}
