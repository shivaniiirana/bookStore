import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorSchema } from './schema/author.schema';

import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
    LoggerModule,
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
