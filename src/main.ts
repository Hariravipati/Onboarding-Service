import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('Starting Onboarding Service...');
    
    const app = await NestFactory.create(AppModule);
    logger.log('NestJS application created successfully');

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    logger.log('Global exception filter and response interceptor registered');

    const config = new DocumentBuilder()
      .setTitle('Onboarding Service API')
      .setDescription('NestJS Onboarding Service with MSSQL')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    logger.log('Swagger documentation configured at /api');

    const port = process.env.PORT || 3004;
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