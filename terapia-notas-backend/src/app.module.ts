import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';

// Importar módulos de la aplicación
import { ClinicsModule } from './modules/clinics/clinics.module';
import { GroupsModule } from './modules/groups/groups.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotesModule } from './modules/notes/notes.module';
import { MtprModule } from './modules/mtpr/mtpr.module';
import { MultidisciplinaryModule } from './modules/multidisciplinary/multidisciplinary.module';
import { GoalTrackingModule } from './modules/goal-tracking/goal-tracking.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Configuración de tareas programadas (cron jobs)
    ScheduleModule.forRoot(),

    // Módulos de la aplicación - Fase 1 (RF-001 a RF-009, RF-037)
    ClinicsModule,      // RF-037: Configuración de clínica
    GroupsModule,       // RF-001 a RF-003: Gestión de grupos
    PatientsModule,     // RF-004 a RF-006: Gestión de pacientes
    ActivitiesModule,   // Actividades, subactividades y párrafos
    AttendanceModule,   // RF-007 a RF-009: Registro de asistencia
    UsersModule,        // RF-001: Gestión de usuarios
    AuthModule,         // Autenticación y autorización JWT
    NotesModule,        // RF-015: Generación de notas diarias
    MtprModule,         // RF-018 a RF-027: Master Treatment Plan Review
    MultidisciplinaryModule, // RF-031 a RF-033: Juntas multidisciplinarias
    GoalTrackingModule, // Tracking y cumplimiento de objetivos del paciente
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
