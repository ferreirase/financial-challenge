import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTables1707354811792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criação da tabela User
        await queryRunner.createTable(new Table({
            name: "users",
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
            name: "accounts",
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
                    name: "user",
                    type: "uuid",
                },
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "transactions",
            columns: [
                {
                    name: "id",
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: "amount",
                    type: "float",
                },
                {
                    name: "status",
                    type: "varchar",
                },
                {
                    name: "senderAccount",
                    type: "uuid",
                },
                {
                    name: "receiverAccount",
                    type: "uuid",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
            ]
        }), true);

        // Criação da chave estrangeira entre Account e User
        await queryRunner.createForeignKey("accounts", new TableForeignKey({
            columnNames: ["user"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // Defina a ação de exclusão em cascata, se necessário
            name: 'user'
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["senderAccount"],
            referencedColumnNames: ["id"],
            referencedTableName: "accounts",
            onDelete: "CASCADE", // Defina a ação de exclusão em cascata, se necessário
            name: "senderAccountId"
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["receiverAccount"],
            referencedColumnNames: ["id"],
            referencedTableName: "accounts",
            onDelete: "CASCADE", // Defina a ação de exclusão em cascata, se necessário
            name: "receiverAccountId"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("accounts");
        await queryRunner.dropTable("users");
        await queryRunner.dropTable("transactions");
    }
}
