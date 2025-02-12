import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    helmet({
      contentSecurityPolicy: false,
      referrerPolicy: false,
      xssFilter: false,
      xContentTypeOptions: false,
      xDownloadOptions: false,
      dnsPrefetchControl: false,
    }),
  );

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
