import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { config } from 'dotenv';
import { CustomExceptionFilter } from './__shared/filters/CustomException.filter';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const whitelist = [
    '*', //delete this on staging
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:5050',
  ];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS error please check!'));
      }
    },
  });
  const config = new DocumentBuilder()
      .setTitle('Bru API')
      .setDescription('Fast is not enough for us!')
      .setVersion(process.env.API_VERSION)
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/v${process.env.API_VERSION}/docs`, app, document);
  const Port: number = parseInt(process.env.PORT) || 7000;
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(Port, () => {
    console.info(`=====================================`);
    console.info(`🚀 App listening on the port: ${Port}`);
    console.info(`=====================================`);
  });
}
bootstrap();
