import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './dto/book.dto';
import { AwsService } from 'src/aws/aws.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { LoggerService } from 'src/logger/logger.service';

interface RequestWithUser extends Request {
  user: {
    authorId: string;
  };
}

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly Awsservice: AwsService,
    private readonly loggerService: LoggerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('addBook')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    description: 'Book creation data',
    type: BookDto,
  })
  @ApiResponse({ status: 201, description: 'Book added successfully' })
  async addBook(
    @Request() req: RequestWithUser,
    @Body() bookDTO: BookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = req.user;
    let uploadedImageUrl: string | undefined;

    if (file) {
      const uploadedImage = await this.Awsservice.uploadFileToS3(file);
      uploadedImageUrl = uploadedImage.Location;
    }

    this.loggerService.log(`User ${user.authorId} is adding a book: ${bookDTO.bookName}`);

    const result = await this.bookService.addBookService({
      ...bookDTO,
      image: uploadedImageUrl,
      authorId: user.authorId,
    });

    this.loggerService.log(`Book added successfully: ${bookDTO.bookName}`);
    return { message: 'Book added', result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateBook/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: BookDto })
  async updateBook(
    @Param('id') param: string,
    @Request() req: RequestWithUser,
    @Body() bookDTO: BookDto,
  ) {
    const user = req.user;
    this.loggerService.log(`User ${user.authorId} is updating book with ID: ${param}`);

    const result = await this.bookService.updateBookService(param, bookDTO, user.authorId);

    this.loggerService.log(`Book with ID: ${param} updated successfully`);
    return result;
  }

  @Get('getBook/:id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', type: String })
  async getBook(@Param('id') param: string) {
    this.loggerService.log(`Fetching book with ID: ${param}`);
    return await this.bookService.getBookService(param);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteBook/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', type: String })
  async deleteBook(@Param('id') param: string, @Request() req: RequestWithUser) {
    const user = req.user;
    this.loggerService.log(`User ${user.authorId} is attempting to delete book with ID: ${param}`);

    const result = await this.bookService.deleteBookService(param, user.authorId);

    this.loggerService.log(`Book with ID: ${param} deleted successfully`);
    return result;
  }

  @Get('fetchByCondition')
  @ApiOperation({ summary: 'Fetch books by category filter' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async fetchAll(
    @Query('category') category: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filters: { category?: string } = {};
    if (category) filters.category = category;

    this.loggerService.log(`Fetching books with filters: ${JSON.stringify(filters)}`);

    const result = await this.bookService.fetchAllBooksService(filters, page, limit);

    this.loggerService.log(`Books fetched successfully with filters: ${JSON.stringify(filters)}`);
    return {
      message: 'Books fetched successfully',
      ...result,
    };
  }

  @Get('fetchAll')
  @ApiOperation({ summary: 'Fetch all books (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async fetchBooks(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    this.loggerService.log(`Fetching all books with page: ${page} and limit: ${limit}`);
    return await this.bookService.fetchBooksService(page, limit);
  }
}
