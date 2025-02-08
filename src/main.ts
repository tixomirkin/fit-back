import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {ValidationPipe} from "@nestjs/common";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
import {options} from "joi";
import fastifyCookie from "@fastify/cookie";
dotenvExpand.expand(dotenv.config())

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  // app.use(cookieParser());
    await app.register(fastifyCookie, {
        secret: 'my-secret', // for cookies signature
    });
  app.enableCors({
      origin: [process.env.ALLOWED_ORIGIN ?? ""],
      credentials: true,
      exposedHeaders: 'set-cookie'
  })

  const config = new DocumentBuilder()
      .setTitle('Fit-API')
      .setDescription('The fit-crm API')
      .setVersion('1.0')
      // .addCookieAuth('Authentication', {
      //   type: 'http',
      //   in: 'Header',
      //   scheme: 'Bearer'
      // })
      // .addSecurity("bearer", {type: "http", scheme: "bearer", bearerFormat: "JWT"})
      .addBearerAuth()
      // .addBearerAuth({type: "http", scheme: "bearer", bearerFormat: "JWT"})
      // .addTag('fit-api')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);

  await app.listen(process.env.APPLICATION_PORT ?? 3000);
}

bootstrap();

