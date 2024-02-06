import UserModel, { IUser } from "../model/User";
import IUserRepository from "./interface";

export default class UserRepository implements IUserRepository {
  async findOneByRegisterNumber(register_number: string) {
    const userFound = await UserModel.findOne({ register_number }).select('-password').exec();

    return userFound?.toObject();
  }

  async findAll(): Promise<Omit<IUser, "password">[] | []> {
    return await UserModel.find({}, { password: 0 }).then((users) => users.map((user) => user.toJSON()));
  }
}
