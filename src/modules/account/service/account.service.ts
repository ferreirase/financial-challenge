import { Account } from '../entity/account.entity';
import AccountImplementationRepository from '../repository/account.implementation';

interface AccountServiceProps {
  accountRepository: AccountImplementationRepository;
}

export interface AccountObserver {
  balanceUpdate(data: IAccountUpdated): Promise<void>;
}

export interface IAccountUpdated {
  sender: Account;
  receiver: Account;
  amount: number;
}

export class AccountObservable {
  private observer: AccountObserver;
  
  private account_updated: IAccountUpdated;

  constructor(observer: AccountObserver){
    this.observer = observer;
  }

  setObserver(observer: AccountObserver) {
    this.observer = observer;
  }

  notifyObservers() {
    this.observer.balanceUpdate(this.account_updated);
  }

  setBalance(data: IAccountUpdated) {
    this.account_updated = data;
    this.notifyObservers();
  }

  bind(accountService: AccountService){
    return this.setObserver(accountService);
  }
}

export default class AccountService implements AccountObserver {
  private accountRepository: AccountImplementationRepository;
  
  constructor({ accountRepository }: AccountServiceProps) {
    this.accountRepository = accountRepository;
  }

  async findByAccountNumber(account_number: string) {
    return await this.accountRepository.findOneByAccountNumber(account_number);
  }

  async balanceUpdate(data: IAccountUpdated): Promise<void> {
    const { sender, receiver, amount } = data;

    await this.accountRepository.updateBalance(sender, receiver, amount);
  }
}
