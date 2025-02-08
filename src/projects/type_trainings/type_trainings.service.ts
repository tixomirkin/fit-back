import {ForbiddenException, Inject, Injectable} from '@nestjs/common';
import { CreateTypeTrainingDto } from './dto/create-type_training.dto';
import { UpdateTypeTrainingDto } from './dto/update-type_training.dto';
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";
import {trainersTable, typeTrainingTable} from "../../drizzle/schema";
import {DrizzleAsyncProvider} from "../../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema";
import {and, eq} from "drizzle-orm";

@Injectable()
export class TypeTrainingsService {

  constructor(@Inject(DrizzleAsyncProvider)
              private db: NodePgDatabase<typeof schema>) {}

  async create(createTypeTrainingDto: CreateTypeTrainingDto, request: RequestWithAccess) {
    const {project} = request
    if (createTypeTrainingDto.defaultTrainerId) {
      const trainer = await this.db.query.typeTrainingTable.findFirst({
        where: and(eq(trainersTable.id, createTypeTrainingDto.defaultTrainerId), eq(trainersTable.projectId, project.id))
      })
      if (!trainer) throw new ForbiddenException("Тренер не найден!")
    }

    return this.db.insert(typeTrainingTable).values({
      projectId: project.id,
      ...createTypeTrainingDto
    }).returning()
  }

  findAll(request: RequestWithAccess) {
    const {project} = request
    return this.db.query.typeTrainingTable.findMany({
      where: eq(typeTrainingTable.projectId, project.id)
    })
  }

  async findOne(id: number, request: RequestWithAccess) {
    const {project} = request
    const typeTraining = await this.db.query.typeTrainingTable.findFirst({
      where: and(eq(typeTrainingTable.id, id), eq(typeTrainingTable.projectId, project.id))
    })
    if (!typeTraining) throw new ForbiddenException('Тип тренировки не найден!')
    return typeTraining;
  }

  async update(id: number, updateTypeTrainingDto: UpdateTypeTrainingDto, request: RequestWithAccess) {
    const {project} = request

    if (updateTypeTrainingDto.defaultTrainerId) {
      const trainer = await this.db.query.typeTrainingTable.findFirst({
        where: and(eq(trainersTable.id, updateTypeTrainingDto.defaultTrainerId), eq(trainersTable.projectId, project.id))
      })
      if (!trainer) throw new ForbiddenException("Тренер не найден!")
    }

    const [newTypeTraining] = await this.db
        .update(typeTrainingTable)
        .set(updateTypeTrainingDto)
        .where(and(eq(typeTrainingTable.id, id), eq(typeTrainingTable.projectId, project.id))).returning()
    if (!newTypeTraining) throw new ForbiddenException('Тип тренировки не найден!')
    return newTypeTraining
  }

  async remove(id: number, request: RequestWithAccess) {
    const {project} = request
    const [deletedTypeTraining] = await this.db
        .delete(typeTrainingTable)
        .where(and(eq(typeTrainingTable.id, id), eq(typeTrainingTable.projectId, project.id)))
        .returning()
    if (!deletedTypeTraining) throw new ForbiddenException('Тип тренировки не найден!')
    return true
  }
}
