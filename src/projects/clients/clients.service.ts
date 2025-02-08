import {ForbiddenException, Inject, Injectable} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {DrizzleAsyncProvider} from "../../drizzle/drizzle.provider";
import * as schema from "../../drizzle/schema";
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";
import {clientsTable, trainersTable} from "../../drizzle/schema";
import {and, eq} from "drizzle-orm";

@Injectable()
export class ClientsService {
  constructor(@Inject(DrizzleAsyncProvider)
              private db: NodePgDatabase<typeof schema>) {}

  create(createClientDto: CreateClientDto, request: RequestWithAccess) {
    const {project} = request
    return this.db.insert(clientsTable).values({
      projectId: project.id,
      ...createClientDto
    }).returning()
  }

  findAll(request: RequestWithAccess) {
    const {project} = request
    return this.db.query.clientsTable.findMany({
      where: eq(clientsTable.projectId, project.id)
    })
  }

  async findOne(id: number, request: RequestWithAccess) {
    const {project} = request
    const client = await this.db.query.clientsTable.findFirst({
      where: and(eq(clientsTable.id, id), eq(clientsTable.projectId, project.id))
    })
    if (!client) throw new ForbiddenException('Клиент не найден!')
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto, request: RequestWithAccess) {
    const {project} = request
    const [newClient] = await this.db
        .update(clientsTable)
        .set(updateClientDto)
        .where(and(eq(clientsTable.id, id), eq(clientsTable.projectId, project.id))).returning()
    if (!newClient) throw new ForbiddenException('Клиент не найден!')
    return newClient
  }

  async remove(id: number, request: RequestWithAccess) {
    const {project} = request
    const [deletedClient] = await this.db
        .delete(clientsTable)
        .where(and(eq(clientsTable.id, id), eq(clientsTable.projectId, project.id)))
        .returning()
    if (!deletedClient) throw new ForbiddenException('Тренер не найден!')
    return true
  }
}
