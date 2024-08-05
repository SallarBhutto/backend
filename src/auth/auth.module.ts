import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisService } from '../redis/redis.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key', // JWT secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    UserModule,
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy, RedisService],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    // Debugging: Check if JWT_SECRET is correctly set
    console.log('JWT_SECRET AuthModule:', process.env.JWT_SECRET);
  }
}
