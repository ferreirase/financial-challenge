import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../../../modules/user/entity/user.entity";

export class SeedUsers1707358268056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
