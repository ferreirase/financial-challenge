import AccountRepository from '../repository/account.mongo.repository';

interface AccountServiceProps {
  accountRepository: AccountRepository;
}

export default class AccountService {
  private accountRepository: AccountRepository;
  
  constructor({ accountRepository }: AccountServiceProps) {
    this.accountRepository = accountRepository;
  }

  async findByAccountNumber(account_number: string) {
    return await this.accountRepository.findOneByAccountNumber(account_number);
  }
}
