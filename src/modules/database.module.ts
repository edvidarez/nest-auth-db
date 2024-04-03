import { Module, OnApplicationShutdown } from '@nestjs/common';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../models/user.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: parseInt(configService.get('PG_PORT')),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DB'),
        entities: [User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    if (!this.dataSource.isInitialized) return;
    await this.dataSource.destroy();
  }
}
