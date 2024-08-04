import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT secret
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, RedisService],
  exports: [AuthService],
})
export class AuthModule {}
