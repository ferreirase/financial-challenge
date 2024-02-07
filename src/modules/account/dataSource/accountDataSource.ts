import type { DataSource } from 'layered-loader';
import type { Account } from '../entity/account.entity';

import type { AccountModuleDependencies } from '../diConfig';
import AccountImplementationRepository from '../repository/account.implementation';

export class AccountDataSource implements DataSource<Account> {
  name = 'Account loader';
  private accountRepository: AccountImplementationRepository;

  constructor({ accountRepository }: AccountModuleDependencies) {
    this.accountRepository = accountRepository;
  }
  
  get(register_number: string) {
    return this.accountRepository.findOneByAccountNumber(register_number);
  };
  
  getMany() {
    return this.accountRepository.findAll();
  }
}
