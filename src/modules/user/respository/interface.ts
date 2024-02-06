import { IUser } from "../model/User";

export default interface IUserRepository {
  findOneByRegisterNumber(register_number: string): Promise<Omit<IUser, 'password'> | undefined>;
  findAll(): Promise<Array<Omit<IUser, 'password'>> | []>;
}