import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import {DrizzleModule} from "../../drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
