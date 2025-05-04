import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import { BookModule } from 'src/book/book.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    forwardRef(() => BookModule),
    LoggerModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule, CategoryService],
})
export class CategoryModule {}
