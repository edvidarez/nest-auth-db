import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProtectedController } from '../controllers/protected.controller';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, ProtectedController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('protected');
  }
}
