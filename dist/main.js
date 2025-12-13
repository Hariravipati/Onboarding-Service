"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./filters/global-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        logger.log('Starting Onboarding Service...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        logger.log('NestJS application created successfully');
        app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
        logger.log('Global exception filter registered');
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Onboarding Service API')
            .setDescription('NestJS Onboarding Service with MSSQL')
            .setVersion('1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
        logger.log('Swagger documentation configured at /api');
        await app.listen(3000);
        logger.log('Application is running on: http://localhost:3000');
        logger.log('Swagger UI available at: http://localhost:3000/api');
        logger.log('Onboarding Service started successfully');
    }
    catch (error) {
        logger.error('Failed to start application', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map