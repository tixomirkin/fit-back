import {BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {DrizzleAsyncProvider} from "../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../drizzle/schema";
import {usersTable, projectsTable, accessTable, roleEnum} from "../drizzle/schema";
import {and, eq} from "drizzle-orm";
import RequestWithAccess from "../permissions/requestWithAccess.interfce";

@Injectable()
export class ProjectsService {
  constructor(@Inject(DrizzleAsyncProvider)
              private db: NodePgDatabase<typeof schema>) {
  }

  async create(createProjectDto: CreateProjectDto, user: typeof usersTable) {
    return this.db.transaction(async (tx) => {
      if (createProjectDto.slug) {
        const [existingProject] = await tx
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.slug, createProjectDto.slug))

        if (existingProject) throw new BadRequestException("Проект с таким slug уже создан!");
      }

      const [newProject] = await tx.insert(projectsTable).values(createProjectDto).returning()

      const [newAccess] = await tx.insert(accessTable).values({
        userId: String(user.id),
        projectId: newProject.id,
        role: "owner",
      }).returning()

      return {...newProject, role: newAccess.role, accessDate: newAccess.createdAt};
    })
  }

  async getUserProjects(user: typeof usersTable) {
    return this.db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        address: projectsTable.address,
        slug: projectsTable.slug,
        createdAt: projectsTable.createdAt,
        role: accessTable.role,
        trainerId: accessTable.trainerId,
        accessDate: accessTable.createdAt,
      })
      .from(projectsTable)
      .innerJoin(accessTable, eq(projectsTable.id, accessTable.projectId))
      .where(eq(user.id, accessTable.userId));
  }

  async getOneUserProjects(id: number, user: typeof usersTable) {
    console.log(id)
    const project = await this.db.query.projectsTable.findFirst({
      where: eq(projectsTable.id, id)
    })

    if (!project) throw new NotFoundException("Проект с таким id не найден");

    const access = await this.db.query.accessTable.findFirst({
      where: and(eq(accessTable.userId, user.id), eq(accessTable.projectId, project.id))
    })

    if (!access) throw new ForbiddenException("У вас нет доступа к этому проекту!");

    return {...project, role: access.role,accessDate: access.createdAt };
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, request: RequestWithAccess) {
    const {user, project, access} = request
    // const project = await this.getOneUserProjects(id, user);
    // if (!["owner", "admin"].includes(project.role)) throw new ForbiddenException("У вас нет прав на редактирование проекта!")
    if (updateProjectDto.slug && (project.slug !== updateProjectDto.slug)) {
      const [existingProject] = await this.db
          .select()
          .from(projectsTable)
          .where(eq(projectsTable.slug, updateProjectDto.slug))

      if (existingProject) throw new BadRequestException("Проект с таким slug уже создан!");
    }

    const [updatedProject] = await this.db
        .update(projectsTable)
        .set(updateProjectDto)
        .where(eq(projectsTable.id, id))
        .returning()

    return {...updatedProject, role: access.role, accessDate: access.createdAt };
  }

  async delete(id: number, request: RequestWithAccess) {
    const {user, project, access} = request
    // const project = await this.getOneUserProjects(id, user);
    if (access.role != "owner") throw new ForbiddenException("У вас нет прав на удаление проекта!")
    return this.db.delete(projectsTable).where(eq(projectsTable.id, id));
  }
}
