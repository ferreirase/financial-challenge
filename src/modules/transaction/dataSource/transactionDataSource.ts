import type { DataSource } from 'layered-loader';
import type { ITransaction } from '../model/Transaction';

import type { TransactionModuleDependencies } from '../diConfig';
import type ITransactionRepository from '../repository/interface';

export class TransactionDataSource implements DataSource<ITransaction> {
  name = 'Transaction loader';
  private transactionRepository: ITransactionRepository;

  constructor({ transactionRepository }: TransactionModuleDependencies) {
    this.transactionRepository = transactionRepository;
  }
  
  get(transaction_id: string): Promise<ITransaction | null | undefined> {
    return this.transactionRepository.findOneById(transaction_id);
  };
  
  getMany() {
    return this.transactionRepository.findAll();
  }
}
