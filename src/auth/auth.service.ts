import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from 'src/author/schema/author.schema';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { sign, SignOptions } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Author.name) private UserModel: Model<Author>,
    private configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  async signUpService(userDto: RegisterDto) {
    const userExists = await this.UserModel.findOne({ email: userDto.email });
    if (userExists) {
      this.loggerService.warn(`User already exists: ${userDto.email}`);
      throw new ConflictException('User already exists');
    }

    const hashedPwd = await argon2.hash(userDto.password);
    this.loggerService.log(`Password hashed for user: ${userDto.email}`);

    const newUser = new this.UserModel({
      ...userDto,
      password: hashedPwd,
    });
    const savedUser = await newUser.save();

    this.loggerService.log(`User registered: ${savedUser._id}`);

    return {
      message: 'User registered successfully',
      userId: savedUser._id,
      email: savedUser.email,
    };
  }

  async loginService(loginDto: LoginDto) {
    const user = (await this.UserModel.findOne({
      email: loginDto.email,
    })) as Author;
    if (!user) {
      this.loggerService.warn(`Invalid login attempt - User not found: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const pwdValid = await argon2.verify(user.password, loginDto.password);
    if (!pwdValid) {
      this.loggerService.warn(`Invalid login attempt - Incorrect password: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      userName: user.userName,
    };

    const token: string = sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.EXPIRES_IN,
      } as SignOptions,
    );

    this.loggerService.log(`Login successful for user: ${loginDto.email}`);

    return {
      message: 'Login successful',
      token,
      authorId: user._id,
    };
  }
}
