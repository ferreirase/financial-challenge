import { createConnection } from 'typeorm';
import { Migration } from 'typeorm/migration/Migration';
import { MigrationExecutor } from 'typeorm/migration/MigrationExecutor';
import { getConfig } from './dataSource';

export class MigrationsManager {
  static async runMigrationByName(command: 'up' | 'down', migrationName: string) {
    const connection = await createConnection(getConfig());
    const migrationExecutor = new MigrationExecutor(connection);
  
    const migrations: Migration[] = await migrationExecutor.getAllMigrations();
    
    console.log(migrations);

    const migration = migrations.find(migration => migration.name === migrationName);
    
    if (!migration) {
      throw new Error(`Migration ${migrationName} not found.`);
    }
  
    return command === 'up' ? await migrationExecutor.executeMigration(migration) : await migrationExecutor.deleteMigration(migration);
  }
}

// CreateTables1707354811792
// SeedUsers1707358268056
// SeedAccounts1707357499748

(async () => {
  await MigrationsManager.runMigrationByName('up', 'CreateTables1707354811792');
})();