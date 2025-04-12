import {ForbiddenException, Inject, Injectable} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";
import {scheduleTable, trainersTable} from "../../drizzle/schema";
import {DrizzleAsyncProvider} from "../../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema";
import {and, between, eq} from "drizzle-orm";

@Injectable()
export class ScheduleService {
  constructor(@Inject(DrizzleAsyncProvider)
              private db: NodePgDatabase<typeof schema>) {
  }

  async create(createScheduleDto: CreateScheduleDto, request: RequestWithAccess) {
    const {project} = request
    if (createScheduleDto.trainerId) {
      const trainer = await this.db.query.trainersTable.findFirst({
        where: and(eq(trainersTable.id, createScheduleDto.trainerId), eq(trainersTable.projectId, project.id))
      })
      if (!trainer) throw new ForbiddenException('Тренер не найден!')
    }

    return this.db.insert(scheduleTable).values({
      projectId: project.id,
      ...createScheduleDto
    }).returning()
  }

  findAll(startDate: Date, endDate: Date, request: RequestWithAccess) {
    // const endDay = new Date(day.getTime());
    // day.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 59)
    return this.db.query.scheduleTable.findMany({
      where: between(scheduleTable.startDate, startDate, endDate)
    });
  }

  async findOne(id: number, request: RequestWithAccess) {
    const {project} = request
    const event = await this.db.query.scheduleTable.findFirst({
      where: and(eq(scheduleTable.id, id), eq(scheduleTable.projectId, project.id))
    })
    if (!event) throw new ForbiddenException('Событие не найдено!')
    return event;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto, request: RequestWithAccess) {
    const {project} = request
    if (updateScheduleDto.trainerId) {
      const trainer = await this.db.query.trainersTable.findFirst({
        where: and(eq(trainersTable.id, updateScheduleDto.trainerId), eq(trainersTable.projectId, project.id))
      })
      if (!trainer) throw new ForbiddenException('Тренер не найден!')
    }

    const [newEvent] = await this.db
        .update(scheduleTable)
        .set(updateScheduleDto)
        .where(and(eq(scheduleTable.id, id), eq(scheduleTable.projectId, project.id))).returning()
    return newEvent;
  }

  async remove(id: number, request: RequestWithAccess) {
    const {project} = request
    const [deletedEvent] = await this.db
        .delete(scheduleTable)
        .where(and(eq(scheduleTable.id, id), eq(scheduleTable.projectId, project.id)))
        .returning()
    if (!deletedEvent) throw new ForbiddenException('Событие не найдено!')
    return true
  }
}
