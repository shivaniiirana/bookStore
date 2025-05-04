import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Shivani',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Rana',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'shivani123',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'shivani@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for account',
    example: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
