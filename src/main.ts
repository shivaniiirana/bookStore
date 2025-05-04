import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  const config = new DocumentBuilder()
    .setTitle('Book Inventory Store')
    .setDescription('API docs for Book Inventory Store')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  console.log('process.env.JWT_SECRET:', process.env.JWT_SECRET);
  console.log('process.env.AWS_ACCESS_KEY_ID:', process.env.ACCESS_KEY_ID);
  console.log('process.env.AWS_SECRET_ACCESS_KEY:', process.env.SECRET_ACCESS_KEY);

  await app.listen(3001);
}

void bootstrap();
