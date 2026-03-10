import 'reflect-metadata'
import { DataSource } from 'typeorm'
import Config from './config'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.DB_HOST || 'localhost',
  port: parseInt(Config.DB_PORT || '5432'),
  username: Config.DB_USER || 'root',
  password: Config.DB_PASSWORD || 'root',
  database: Config.DATABASE_NAME || 'auth_service',
  // synchronize: true will automatically create the database schema on application startup based on your entities.
  synchronize: false,
  logging: false,
  entities: ['src/entity/*.ts'],
  migrations: ['src/migrations/*.ts'],

  // subscribers: [],
  migrationsTableName: 'custom_migrations_table',
})
