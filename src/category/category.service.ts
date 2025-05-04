import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { AddCategoryDTO } from './dto/addCat.dto';
import { Book } from 'src/book/schema/bookSchema';
import { BookService } from 'src/book/book.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @Inject(forwardRef(() => BookService)) private bookService: BookService,
    private readonly loggerService: LoggerService,
  ) {}

  async AddCategoryService(addCategoryDto: AddCategoryDTO) {
    const created = await this.categoryModel.create(addCategoryDto);
    this.loggerService.log(`Category created: ${created.categoryId}`);
    return created;
  }

  async fetchByConditionService(categoryId: string) {
    const category = await this.categoryModel.findOne({ categoryId });

    if (!category) {
      this.loggerService.warn(`Category not found for fetch: ${categoryId}`);
      throw new NotFoundException('no book in this category');
    }

    const books = await this.bookModel.find({ categoryId });
    this.loggerService.log(`Fetched ${books.length} book(s) for categoryId: ${categoryId}`);
    return books;
  }

  async deleteCategoryService(categoryId: string) {
    const category = await this.categoryModel.findOne({ categoryId });

    if (!category) {
      this.loggerService.warn(`Delete failed: Category not found: ${categoryId}`);
      throw new NotFoundException('Category not found');
    }

    await category.deleteOne();
    this.loggerService.log(`Category deleted: ${categoryId}`);
    return { message: 'Category deleted successfully' };
  }
}
