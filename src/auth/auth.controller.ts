import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupResponseDto } from './dto/signup-response-dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({
    status: 200,
    description: 'Sign up user',
    type: SignupResponseDto, // Should be a single type instead of an array
  })
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.authService.signup(createUserDto, res);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: SignupResponseDto, // This should match your login response type
  })
  @Post('signin')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { email, password } = loginDto;
    try {
      return await this.authService.login(email, password, res);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @Post('signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies['access_token']; // Retrieve token from cookies
      if (!token) {
        throw new UnauthorizedException('No token found');
      }
      await this.authService.signout(res, token);
      return res.json({ message: 'Successfully logged out' });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'Returns user information if authenticated',
    type: SignupResponseDto,
  })
  @Post('check')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies['access_token'];
      if (!token) {
        return res.status(401).json({ message: 'No token found' });
      }

      const user = await this.authService.checkAuth(token, res);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      return res.json({ user });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
