import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
    @ApiProperty({ description: 'The username of the user' })
    @IsString()
    @MinLength(4)
    @IsNotEmpty({ message: 'Email is required' })
    username: string;
  
    @ApiProperty({ description: 'The email of the user' })
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @ApiProperty({ description: 'The password of the user' })
    @IsString()
    @MinLength(8)
    @IsNotEmpty({ message: 'Email is required' })
    password: string;
}
