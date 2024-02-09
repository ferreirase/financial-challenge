import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export function getConfig() {
    return {
        type: 'postgres',
        host: 'postgresdb',
        port: 5432,
        username: 'postgres',
        password: 'docker',
        database: 'doopay',
        synchronize: false,
        migrations: ['src/infra/database/migrations/**/*.ts'],
        entities: ['src/modules/**/entity/*.ts'],
    } as DataSourceOptions;
}; 
