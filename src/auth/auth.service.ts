import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async login(user: any) {
    const payload = { sub: user._id };
    const token = this.jwtService.sign(payload);

    await this.redisService.setToken(user._id, token);

    return { access_token: token };
  }

  async validateUser(id: string): Promise<any> {
    return this.userService.findOne(id);
  }
}
