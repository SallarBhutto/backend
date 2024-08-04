import { IsString, IsEmail, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @MinLength(4)
    username: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    password: string;
}
