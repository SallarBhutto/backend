import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignupResponseDto } from './dto/signup-response-dto';
import { Response } from 'express';

const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {
    console.log("AuthService: ", process.env.JWT_SECRET);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      Logger.error('JWT_SECRET is not set!');
    } else {
      Logger.log('JWT_SECRET is set.');
    }
  }

  private setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'lax', // Adjust based on your CSRF protection needs
      maxAge: 3600000, // 1 hour in milliseconds
    });
  }

  async login(email: string, password: string, res: Response): Promise<Response> {
    try {
      // Find the user by email
      const user: User = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if(user._id){
        // Generate JWT token
        const payload = { sub: user._id.toString() };
        const token = this.jwtService.sign(payload);

        // Store token in Redis
        await this.redisService.setToken(user._id.toString(), token);

        this.setCookie(res, token);

        // Return response with user details
        return res.json({
          username: user.username,
          email: user.email,
        })
      }else{
        throw new Error(`something went wrong`);
      }
    } catch (error) {
      throw new Error(`Error logging in: ${error.message}`);
    }
  }

  async validateUser(id: string): Promise<any> {
    return this.userService.findOne(id);
  }

  async signup(createUserDto: CreateUserDto, res: Response): Promise<Response> {
    try {
      // Encrypt the user's password
      const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);

      // Create a new user with the hashed password
      const newUser: User = await this.userService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Ensure _id is converted to string
      const userIdString = newUser._id ? newUser._id.toString() : '';

      // Generate JWT token
      const payload = { sub: userIdString };
      const token = this.jwtService.sign(payload);

      // // Store token in Redis
      await this.redisService.setToken(userIdString, token);

      this.setCookie(res, token);

      // Return response with user details and token
      return res.json({
        username: newUser.username,
        email: newUser.email,
      })
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async signout(res: Response, token: string): Promise<void> {
    try {
      // Remove token from Redis
      await this.redisService.removeToken(token);

      // Delete the HTTP-only cookie
      res.cookie('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0), // Set cookie expiration to the past
      });
    } catch (error) {
      throw new Error(`Error logging out: ${error.message}`);
    }
  }

  async checkAuth(token: string, res: Response): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;
      
      // Check token existence in Redis
      const storedToken = await this.redisService.getToken(userId);
      if (storedToken !== token) {
        return null;
      }

      // Retrieve user information
      const user = await this.userService.findOne(userId);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email
      })
    } catch (error) {
      return null;
    }
  }
}
