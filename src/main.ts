import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Easygenerator Auth App')
    .setDescription('Hiring task.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);
  
  app.use(cookieParser());

  const allowedOrigins = [
    'http://localhost:3000',  // Local development
    'http://frontend:3000',   // Docker environment
    // Add other origins as needed
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allowed: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true, 
  });
  await app.listen(3001);
  console.log('Backend is up on 3001');
}
bootstrap();
