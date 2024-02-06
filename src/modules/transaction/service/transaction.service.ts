import TransactionRepository from '../repository/transaction.mongo.repository';

interface TransactionServiceProps {
  transactionRepository: TransactionRepository;
}

export default class TransactionService {
  private transactionRepository: TransactionRepository;
  
  constructor({ transactionRepository }: TransactionServiceProps) {
    this.transactionRepository = transactionRepository;
  }

  async findByTransactionId(transaction_id: string) {
    return await this.transactionRepository.findOneById(transaction_id);
  }
}
