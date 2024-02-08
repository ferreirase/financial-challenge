import { QueryRunner, getRepository } from 'typeorm';
import { Account } from "../../../modules/account/entity/account.entity";
import { User } from "../../../modules/user/entity/user.entity";

export class SeedsManager {
  static async executeUsers(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        name: 'Anderson Raphael Ferreira',
        email: 'anderson@doopay.com.br',
        password: '$1$vPPi3S5C$KS.NxxvgC9XRzRAT93kuY1',
        type: 'PF',
        register_number: '62624506020',
      },
      {
        name: 'Tayse Silva',
        email: 'tayse@doopay.com.br',
        password: '$1$vPPi3S5C$KS.NxxvgC9XRzRAT93kuY1',
        type: 'PF',
        register_number: '18682960087',
      },
    ])
    .execute();
  }

  static async executeAccounts(queryRunner: QueryRunner): Promise<void> {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      for (const user of users) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values({
            accountNumber: '123456',
            balance: 100,
            user: user
          })
          .execute();

        console.log('Conta inserida para o usuário com ID:', user.id);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao inserir contas:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
