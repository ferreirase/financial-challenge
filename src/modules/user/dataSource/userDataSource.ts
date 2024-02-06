import type { DataSource } from 'layered-loader';
import type { IUser } from '../model/User';

import type { UsersModuleDependencies } from '../diConfig';
import type IUserRepository from '../respository/interface';

export class UserDataSource implements DataSource<IUser> {
  name = 'User loader';
  private userRepository: IUserRepository;

  constructor({ userRepository }: UsersModuleDependencies) {
    this.userRepository = userRepository;
  }
  
  get(register_number: string): Promise<IUser | null | undefined> {
    return this.userRepository.findOneByRegisterNumber(register_number);
  };
  
  getMany() {
    return this.userRepository.findAll();
  }
}