import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDTO } from './dto/addCat.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  async addCategory(@Body() addCategoryDto: AddCategoryDTO) {
    console.log('inside controller');
    console.log(addCategoryDto);
    return await this.categoryService.AddCategoryService(addCategoryDto);
  }

  @Delete('deleteCategory/:id')
  async deleteCategory(@Param('id') categoryId: string) {
    return await this.categoryService.deleteCategoryService(categoryId);
  }

  @Get('fetchCategory/:id')
  async fetchByCondition(@Param('id') categoryId: string) {
    return await this.categoryService.fetchByConditionService(categoryId);
  }
}
