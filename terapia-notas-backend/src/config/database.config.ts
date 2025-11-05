import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'terapia_nota_db'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // BD gestionada por scripts SQL
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<boolean>('DB_SSL_ENABLED', false) ? { rejectUnauthorized: false } : false,
});
