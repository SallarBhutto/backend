import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://root:example@127.0.0.1:27017/easygenerator?authSource=admin"),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
