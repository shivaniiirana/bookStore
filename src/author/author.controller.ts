import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { LoggerService } from 'src/logger/logger.service';

interface RequestWithUser extends Request {
  user: {
    authorId: string;
  };
}

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly loggerService: LoggerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get logged-in author profile' })
  @ApiResponse({ status: 200, description: 'Successfully fetched profile' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @Get('me')
  myProfile(@Request() req: RequestWithUser) {
    const { authorId } = req.user;
    this.loggerService.log(`Fetching author profile ${authorId}`);
    return this.authorService.myProfileService(authorId);
  }
}
