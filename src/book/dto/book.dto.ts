import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty({
    description: 'Unique ID for the book',
    example: 'book123',
  })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    description: 'ID of the author who wrote the book',
    example: 'author456',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    description: 'Name of the book',
    example: 'Node.js for Beginners',
  })
  @IsString()
  @IsNotEmpty()
  bookName: string;

  @ApiProperty({
    description: 'Title of the book',
    example: 'Mastering Node.js',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Short description about the book',
    example: 'This book covers the fundamentals of Node.js with examples.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Year when the book was published',
    example: '2024',
  })
  @IsString()
  @IsNotEmpty()
  publicationYear: string;

  @ApiProperty({
    description: 'Category or genre of the book',
    example: 'Programming',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Optional image URL or file name for the book cover',
    example: 'image',
  })
  image?: string;
}
