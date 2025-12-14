import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('Starting Onboarding Service...');
    
    const app = await NestFactory.create(AppModule);
    logger.log('NestJS application created successfully');

    app.useGlobalFilters(new GlobalExceptionFilter());
    logger.log('Global exception filter registered');

    const config = new DocumentBuilder()
      .setTitle('Onboarding Service API')
      .setDescription('NestJS Onboarding Service with MSSQL')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    logger.log('Swagger documentation configured at /api');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on port: ${port}`);
    logger.log('Swagger UI available at: /api');
    logger.log('Onboarding Service started successfully');
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}
bootstrap();