import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ required: true })
  bookId: string;
  @Prop({ required: true })
  authorId: string;
  @Prop({ required: true })
  bookName: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  publicationYear: string;
  // @Prop({ required: true })
  // category: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop()
  image: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
