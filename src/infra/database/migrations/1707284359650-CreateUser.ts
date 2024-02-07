import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUser1707284359650 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criação da tabela User
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "email",
                    type: "varchar",
                },
                {
                    name: "type",
                    type: "varchar",
                },
                {
                    name: "register_number",
                    type: "varchar",
                },
                {
                    name: "password",
                    type: "varchar",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
            ]
        }), true);

        // Criação da tabela Account
        await queryRunner.createTable(new Table({
            name: "account",
            columns: [
                {
                    name: "id",
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: "accountNumber",
                    type: "varchar",
                },
                {
                    name: "balance",
                    type: "float",
                },
                {
                    name: "userId",
                    type: "uuid",
                },
            ]
        }), true);

        // Criação da chave estrangeira entre Account e User
        await queryRunner.createForeignKey("account", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE" // Defina a ação de exclusão em cascata, se necessário
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("account");
        await queryRunner.dropTable("user");
    }

}
