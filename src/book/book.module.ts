import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schema/bookSchema';
import { AwsService } from 'src/aws/aws.service';
import { RedisModule } from 'src/redis/redis.module';
import { LoggerModule } from 'src/logger/logger.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    RedisModule,
    LoggerModule,
    forwardRef(() => CategoryModule),
  ],
  controllers: [BookController],
  providers: [BookService, AwsService],
  exports: [BookService, MongooseModule],
})
export class BookModule {}
