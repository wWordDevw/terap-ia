import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos implícitamente
      },
    }),
  );

  // Habilitar CORS - Permitir todos los orígenes en desarrollo
  app.enableCors({
    origin: true, // Permitir todos los orígenes
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api/v1');

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Terapia Nota Backend API')
    .setDescription(
      'API REST para el sistema de generación de notas terapéuticas. ' +
      'Incluye gestión de pacientes, grupos, asistencia, actividades y generación automática de documentos Word (Notas Diarias, MTPR, Juntas Multidisciplinarias).'
    )
    .setVersion('1.0')
    .addTag('Auth', 'Autenticación y autorización con JWT')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Clinics', 'Gestión de clínicas')
    .addTag('Groups', 'Gestión de grupos terapéuticos y semanas')
    .addTag('Patients', 'Gestión de pacientes, goals y diagnósticos')
    .addTag('Activities', 'Biblioteca de actividades y párrafos predefinidos')
    .addTag('Attendance', 'Registro y control de asistencia')
    .addTag('Notes', 'Generación de notas diarias en Word')
    .addTag('MTPR', 'Master Treatment Plan Review - Revisiones de 90 días')
    .addTag('Multidisciplinary', 'Juntas multidisciplinarias')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Terapia Nota API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  Servidor iniciado correctamente
  URL: http://localhost:${port}/api/v1
  Docs: http://localhost:${port}/api/docs
  Base de datos: PostgreSQL
  Sistema: Terapia Nota Backend
  `);
}
bootstrap();
