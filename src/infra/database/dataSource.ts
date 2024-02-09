import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export function getConfig() {
    return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: false,
        migrations: ['src/infra/database/migrations/**/*.ts'],
        entities: ['src/modules/**/entity/*.ts'],
    } as DataSourceOptions;
}; 
