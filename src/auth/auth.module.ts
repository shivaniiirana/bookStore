import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Author, AuthorSchema } from 'src/author/schema/author.schema';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwtAuth.guard';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]), LoggerModule],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
