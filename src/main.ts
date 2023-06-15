import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(), //Habilitar el Cors

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,    // transforma los parametros automaticamente segun el Dto
      transformOptions:{
        enableImplicitConversion: true,
      }
    })
  );
  await app.listen(process.env.PORT);
}
bootstrap();
