import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/bookSchema';
import { Model } from 'mongoose';
import { BookDto } from './dto/book.dto';
import { RedisService } from 'src/redis/redis.service';
import { Category } from 'src/category/schema/category.schema';
import { CategoryService } from 'src/category/category.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private readonly redisService: RedisService,
    private readonly loggerService: LoggerService,
  ) {}

  private async clearBookCache() {
    const keys = await this.redisService.keys('books_page_*');
    if (keys.length > 0) {
      await this.redisService.del(...keys);
      this.loggerService.log('Cache cleared for book pages');
    }
  }

  async addBookService(bookDTO: BookDto): Promise<Book> {
    const newBook = await this.bookModel.create(bookDTO);
    await this.clearBookCache();
    this.loggerService.log(`Book created: ${newBook.bookId}`);

    const categoryDoc = await this.categoryModel.findOne({ categoryId: bookDTO.categoryId });
    if (!categoryDoc) {
      this.loggerService.warn(`Category not found: ${bookDTO.categoryId}`);
      throw new NotFoundException('Category not found');
    }

    categoryDoc.bookIds.push(newBook._id.toString());
    await categoryDoc.save();

    return newBook;
  }

  async updateBookService(id: string, newBook: BookDto, authorId: string) {
    const bookForUpdate = await this.bookModel.findOne({ bookId: id });
    if (!bookForUpdate) {
      this.loggerService.warn(`Book not found for update: ${id}`);
      throw new NotFoundException('Book not found');
    }
    if (bookForUpdate.authorId !== authorId) {
      this.loggerService.warn(`Unauthorized update attempt for book: ${id}`);
      throw new UnauthorizedException('Unauthorized');
    }

    await this.bookModel.updateOne({ bookId: id }, newBook);
    await this.clearBookCache();
    this.loggerService.log(`Book updated: ${id}`);

    return { message: 'Book updated', newBook };
  }

  async deleteBookService(id: string, authorId: string) {
    const book = await this.bookModel.findOne({ bookId: id });
    if (!book) {
      this.loggerService.warn(`Book not found for deletion: ${id}`);
      throw new NotFoundException('Book not found');
    }
    if (book.authorId !== authorId) {
      this.loggerService.warn(`Unauthorized delete attempt for book: ${id}`);
      throw new UnauthorizedException('You are not authorized to delete this book');
    }

    await this.bookModel.deleteOne({ bookId: id });
    await this.clearBookCache();
    this.loggerService.log(`Book deleted: ${id}`);

    return { message: 'Book deleted successfully' };
  }

  async getBookService(id: string): Promise<Book> {
    const book = await this.bookModel.findOne({ bookId: id });
    if (!book) {
      this.loggerService.warn(`Book not found: ${id}`);
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async fetchAllBooksService(filters: { category?: string }, page: number = 1, limit: number = 10) {
    const query: Partial<Book> = {};
    if (filters.category) {
      query.categoryId = filters.category;
    }

    const skip = (page - 1) * limit;

    const books = await this.bookModel.find(query).skip(skip).limit(limit);
    const totalBooks = await this.bookModel.countDocuments(query);

    this.loggerService.log(
      `Fetched ${books.length} book(s) for filters: ${JSON.stringify(filters)}`,
    );

    return {
      books,
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    };
  }

  async fetchBooksService(page: number = 1, limit: number = 10) {
    const cacheKey = `books_page_${page}_limit_${limit}`;
    this.loggerService.log(`Fetching books with cache key: ${cacheKey}`);
    const cached = (await this.redisService.get<Book[]>(cacheKey)) || null;

    if (cached) {
      this.loggerService.log('All fetched books from cache');
      return {
        message: 'All fetched books from cache',
        books: cached,
      };
    }

    const books = await this.bookModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    await this.redisService.set(cacheKey, books);
    this.loggerService.log('Fetched books from DB and cached');

    return {
      message: 'All fetched books from DB',
      books,
    };
  }
}
