import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import {AuthService} from "./auth/auth.service";
import { UsersModule } from './users/users.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import Joi from "joi";
import {JwtService} from "@nestjs/jwt";
import { ProjectsModule } from './projects/projects.module';
import { TrainersModule } from './projects/trainers/trainers.module';
import { ClientsModule } from './projects/clients/clients.module';
import { ScheduleModule } from './projects/schedule/schedule.module';
import { TypeTrainingsModule } from './projects/type_trainings/type_trainings.module';
import {APP_GUARD} from "@nestjs/core";
import {ProjectPermissionsGuard} from "./permissions/project-permissions.guard";
import { RegistrationModule } from './projects/registration/registration.module';
import JwtAuthenticationGuard from "./auth/guards/jwt-authentication.guard";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
    // validationSchema: Joi.object({
    //   JWT_SECRET: Joi.string().required(),
    //   JWT_EXPIRATION_TIME: Joi.string().required(),
    // })
  }),
      DrizzleModule, AuthModule, UsersModule, ProjectsModule, TrainersModule, ClientsModule, ScheduleModule, TypeTrainingsModule, RegistrationModule],
  controllers: [AppController],
  providers: [AppService, AuthService,
      {
          provide: APP_GUARD,
          useClass: JwtAuthenticationGuard, // 🛑 Сначала аутентификация
      },
      {
          provide: APP_GUARD,
          useClass: ProjectPermissionsGuard,
      }],
})
export class AppModule {}

