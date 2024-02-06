import { IUser } from "../model/User";

export default interface IUserRepository {
  findOneByRegisterNumber(register_number: string): Promise<IUser | undefined>;
  findAll(): Promise<Array<IUser> | []>;
}