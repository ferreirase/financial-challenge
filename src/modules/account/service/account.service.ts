import { IAccount } from "../model/Account";
import AccountRepository from '../repository/account.mongo.repository';

interface AccountServiceProps {
  accountRepository: AccountRepository;
}

export interface AccountObserver {
  balanceUpdate(data: IAccountUpdated): void;
}

export interface IAccountUpdated {
  sender: Pick<IAccount, 'account_number' | 'balance'>;
  receiver: Pick<IAccount, 'account_number' | 'balance'>;
}

export class AccountObservable {
  private observer: AccountObserver;
  
  private account_updated: IAccountUpdated = { 
    sender: { balance: 0, account_number: ''},
    receiver: { balance: 0, account_number: ''}
  };

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

export default class AccountService implements AccountObserver{
  private accountRepository: AccountRepository;
  
  constructor({ accountRepository }: AccountServiceProps) {
    this.accountRepository = accountRepository;
  }

  async findByAccountNumber(account_number: string) {
    return await this.accountRepository.findOneByAccountNumber(account_number);
  }

  balanceUpdate(data: IAccountUpdated): void {
    const { sender, receiver } = data;

    this.accountRepository.updateBalance(sender.account_number, sender.balance);
    this.accountRepository.updateBalance(receiver.account_number, receiver.balance);
  }
}
