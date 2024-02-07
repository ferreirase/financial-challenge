import { EntityRepository, getRepository } from 'typeorm';
import { Account } from "../../account/entity/account.entity";
import { Transaction } from '../entity/transaction.entity';

@EntityRepository(Transaction)
export default class TransactionImplementationRepository {
  private readonly repo; 

  constructor(){
    this.repo = getRepository(Transaction);
  }

  async findOneById(transaction_id: string) {
    return await this.repo.findOne({
      where: { id: transaction_id }
    });
  }

  async findAll(): Promise<Transaction[] | []> {
    return await this.repo.find();
  }
  
  async create(senderAccount: Account, receiverAccount: Account, amount: number, status: string) {
    const newTransaction = new Transaction();

    newTransaction.sender = senderAccount;
    newTransaction.receiver = receiverAccount;
    newTransaction.amount = amount;
    newTransaction.status = status;

    await this.repo.save(newTransaction);

    return newTransaction;
  }
}
