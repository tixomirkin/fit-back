import { Module } from '@nestjs/common';
import { TypeTrainingsService } from './type_trainings.service';
import { TypeTrainingsController } from './type_trainings.controller';
import {DrizzleModule} from "../../drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule],
  controllers: [TypeTrainingsController],
  providers: [TypeTrainingsService],
})
export class TypeTrainingsModule {}
