import {ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import {DrizzleAsyncProvider} from "../../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema";
import {accessTable, projectsTable, trainersTable, usersTable} from "../../drizzle/schema";
import {and, eq} from "drizzle-orm";
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";

@Injectable()
export class TrainersService {
  constructor(@Inject(DrizzleAsyncProvider)
              private db: NodePgDatabase<typeof schema>) {
  }

  async create(createTrainerDto: CreateTrainerDto, request: RequestWithAccess) {
    const {project} = request
    return this.db.insert(trainersTable).values({
      projectId: project.id,
      ...createTrainerDto
    }).returning()

  }

  findAll(request: RequestWithAccess) {
    const {project} = request
    return this.db.query.trainersTable.findMany({
      where: eq(trainersTable.projectId, project.id)
    })
  }

  async findOne(id: number, request: RequestWithAccess) {
    const {project} = request
    const trainer = await this.db.query.trainersTable.findFirst({
      where: and(eq(trainersTable.id, id), eq(trainersTable.projectId, project.id))
    })
    if (!trainer) throw new ForbiddenException('Тренер не найден!')
    return trainer;
  }

  async update(id: number, updateTrainerDto: UpdateTrainerDto, request: RequestWithAccess) {
    const {project} = request
    const [newTrainer] = await this.db
        .update(trainersTable)
        .set(updateTrainerDto)
        .where(and(eq(trainersTable.id, id), eq(trainersTable.projectId, project.id))).returning()
    if (!newTrainer) throw new ForbiddenException('Тренер не найден!')
    return newTrainer
  }

  async remove(id: number, request: RequestWithAccess) {
    const {project} = request
    const [deletedTrainer] = await this.db
        .delete(trainersTable)
        .where(and(eq(trainersTable.id, id), eq(trainersTable.projectId, project.id)))
        .returning()
    if (!deletedTrainer) throw new ForbiddenException('Тренер не найден!')
    return true
  }
}
