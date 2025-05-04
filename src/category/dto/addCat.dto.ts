import { IsString, IsArray, IsOptional } from 'class-validator';

export class AddCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  categoryId: string;

  @IsArray()
  @IsOptional() // Optional because it can default to an empty array
  bookIds?: string[];
}
