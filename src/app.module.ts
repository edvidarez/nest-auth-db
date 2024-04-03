import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env file
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
