import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  setupSwagger(app);
  await app.listen(3000);
}

const setupSwagger = (app) => {
  const options = new DocumentBuilder()
    .setTitle('User Authentication API')
    .setDescription(
      'Implements a simple API for user sign-up, login, and secure access.',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
bootstrap();
