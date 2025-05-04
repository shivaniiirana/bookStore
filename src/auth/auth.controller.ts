import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async signUp(@Body() userDto: RegisterDto) {
    this.loggerService.log('User registration started');
    const result = await this.authService.signUpService(userDto);
    this.loggerService.log(`User registered: ${userDto.email}`);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(@Body() loginDto: LoginDto) {
    this.loggerService.log('User login attempt started');
    const result = await this.authService.loginService(loginDto);
    this.loggerService.log(`User logged in: ${loginDto.email}`);
    return result;
  }
}
