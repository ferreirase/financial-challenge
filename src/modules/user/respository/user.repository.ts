import { Collection } from 'mongodb';
import { UsersInjectableDependencies } from '../diConfig';
import { IUser } from '../model/User';
import IUserRepository from "./interface";

export default class UserMongoRepository implements IUserRepository {
  private readonly userModel: Collection<IUser>;

  constructor({ mongo }: UsersInjectableDependencies) {
    this.userModel = mongo.db(process.env.MONGO_DBNAME).collection<IUser>('users');
  }

  async findOneByRegisterNumber(register_number: string) {
    const userFound = await this.userModel.findOne({ register_number });

    return userFound?.toObject();
  }

  async findAll() {
    return await this.userModel.find({}, { 
      projection: { password: 0 }
     }).toArray();
  }
}
