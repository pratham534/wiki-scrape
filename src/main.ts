import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000); // Use port 3000 for local development
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    allowedHeaders: '*',
  });
  console.log(`🚀 Application is running on: http://localhost:3000`);
}
bootstrap();
