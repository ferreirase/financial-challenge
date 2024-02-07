import { EntityRepository, getRepository } from 'typeorm';
import { User } from "../entity/user.entity";

@EntityRepository(User)
export default class UserRepositoryImplementation {
  private readonly test; 

  constructor(){
    this.test = getRepository(User);
  }

  async findOneByRegisterNumber(register_number: string) {
    return await this.test.findOne({
       where: {
        register_number,
       }
    })
  }

  async findAll() {
    return await this.test.find({});
  }
}
