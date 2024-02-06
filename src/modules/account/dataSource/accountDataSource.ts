import type { DataSource } from 'layered-loader';
import type { IAccount } from '../model/Account';

import type { AccountModuleDependencies } from '../diConfig';
import type IAccountRepository from '../repository/interface';

export class AccountDataSource implements DataSource<IAccount> {
  name = 'Account loader';
  private accountRepository: IAccountRepository;

  constructor({ accountRepository }: AccountModuleDependencies) {
    this.accountRepository = accountRepository;
  }
  
  get(register_number: string): Promise<IAccount | null | undefined> {
    return this.accountRepository.findOneByAccountNumber(register_number);
  };
  
  getMany() {
    return this.accountRepository.findAll();
  }
}
