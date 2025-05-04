import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from './schema/author.schema';
import { Model } from 'mongoose';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel('Author') private readonly authorModel: Model<Author>,
    private readonly loggerService: LoggerService,
  ) {}

  async myProfileService(authorId: string) {
    // this.loggerService.log(typeof authorId);
    this.loggerService.log(`Searching for author with id ${authorId}`);

    const author = await this.authorModel.findOne({ _id: authorId });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return { message: 'Author found', author };
  }
}
