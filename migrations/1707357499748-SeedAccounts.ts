import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Account } from "../../../modules/account/entity/account.entity";
import { User } from "../../../modules/user/entity/user.entity";

export class SeedAccounts1707357499748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = getRepository(User);

        const users = await userRepository.find();

        await queryRunner.connection
            .createQueryBuilder()
            .insert()
            .into(Account)
            .values([
                {
                    accountNumber: '123456',
                    balance: 100,
                    user: users[0],
                },
                {
                    accountNumber: '654321',
                    balance: 100,
                    user: users[1],
                }
            ]).execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
