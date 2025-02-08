import { Module } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import {DrizzleModule} from "../../drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule],
  controllers: [TrainersController],
  providers: [TrainersService],
})
export class TrainersModule {}
