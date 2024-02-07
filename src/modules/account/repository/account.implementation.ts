import { EntityRepository, getRepository } from 'typeorm';
import { Account } from '../entity/account.entity';

@EntityRepository(Account)
export default class AccountImplementationRepository {
  private readonly repo; 

  constructor(){
    this.repo = getRepository(Account);
  }

  async findOneByAccountNumber(account_number: string) {
    return await this.repo.findOne({
      where: { accountNumber: account_number },
    });
  }

  async findAll() {
    return await this.repo.find();
  }

  async updateBalance(sender: Account, receiver: Account, amount: number) {
    sender.balance -= amount; 
    receiver.balance += amount; 

    await this.repo.save(sender);
    await this.repo.save(receiver);
  }
}
