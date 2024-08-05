import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    Res,
  } from '@nestjs/common';
  import { CreateUserDto } from '../user/dto/create-user.dto';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { AuthService } from './auth.service';
import { SignupResponseDto } from './dto/signup-response-dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
    ) {}
  
    @ApiOperation({ summary: 'Sign up user' })
    @ApiResponse({
      status: 200,
      description: 'Sign up user',
      type: SignupResponseDto, // Should be a single type instead of an array
    })
    @Post("signup")
    create(@Body() createUserDto: CreateUserDto,  @Res() res: Response) {
      return this.authService.signup(createUserDto, res);
    }

    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
      status: 200,
      description: 'User logged in successfully',
      type: SignupResponseDto, // This should match your login response type
    })
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
      const { email, password } = loginDto;
      try {
        return await this.authService.login(email, password, res);
      } catch (error) {
        throw new UnauthorizedException(error.message);
      }
    }
  }
  