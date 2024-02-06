import UserRepository from '../respository/user.repository';

interface UserServiceProps {
  userRepository: UserRepository;
}

export default class UserService {
  private userRepository: UserRepository;
  
  constructor({ userRepository }: UserServiceProps) {
    this.userRepository = userRepository;
  }

  async findUserByRegisterNumber(register_number: string) {
    return await this.userRepository.findOneByRegisterNumber(register_number);
  }

  async findAll(){
    return await this.userRepository.findAll();
  }
}
