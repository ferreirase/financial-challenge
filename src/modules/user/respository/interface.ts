import { User } from "../entity/user.entity";

export default interface IUserRepository {
  findOneByRegisterNumber(register_number: string): Promise<User | null>;
  findAll(): Promise<Array<User> | []>;
}