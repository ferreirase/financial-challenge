import type { DataSource } from 'layered-loader';
import type { Transaction } from '../entity/transaction.entity';

import type { TransactionModuleDependencies } from '../diConfig';
import type TransactionImplementationRepository from '../repository/transaction.implementation.repository';

export class TransactionDataSource implements DataSource<Transaction> {
  name = 'Transaction loader';
  private transactionRepository: TransactionImplementationRepository;

  constructor({ transactionRepository }: TransactionModuleDependencies) {
    this.transactionRepository = transactionRepository;
  }
  
  get(transaction_id: string) {
    return this.transactionRepository.findOneById(transaction_id);
  };
  
  getMany() {
    return this.transactionRepository.findAll();
  }
}
