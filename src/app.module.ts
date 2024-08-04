import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis/redis.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://root:example@127.0.0.1:27017/easygenerator?authSource=admin"),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
  exports: [RedisService]
})
export class AppModule {}
