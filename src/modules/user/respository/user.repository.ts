import { EntityRepository, getRepository } from 'typeorm';
import { User } from "../entity/user.entity";

@EntityRepository(User)
export default class UserRepositoryImplementation {
  private readonly repo; 

  constructor(){
    this.repo = getRepository(User);
  }

  async findOneByRegisterNumber(register_number: string) {
    return await this.repo.findOne({
       where: {
        register_number,
       }
    })
  }

  async findAll() {
    return await this.repo.find({});
  }
}
