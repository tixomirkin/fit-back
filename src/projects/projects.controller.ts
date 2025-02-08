import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request} from '@nestjs/common';
import {ProjectsService} from './projects.service';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PublicProjectDto} from "./dto/public-project.dto";
import RequestWithUser from "../auth/interface/requestWithUser.interface";
import {ProjectPermissions} from "../permissions/permissions.decorator";
import {Permission} from "../permissions/permission-enum";
import RequestWithAccess from "../permissions/requestWithAccess.interfce";

@ApiTags("Projects - Проекты")
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Successful response', type: PublicProjectDto })
  @ApiOperation({ summary: 'Создание проекта' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() request: RequestWithUser) {
    return this.projectsService.create(createProjectDto, request.user);
  }

  @Get()
  @ApiOperation({ summary: 'Получение списка проектов пользователя' })
  findAll(@Request() request: RequestWithUser) {
    return this.projectsService.getUserProjects(request.user);
  }

  @Get(':project_id')
  @ApiOperation({ summary: 'Получение проекта по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  findOne(@Param('project_id', ParseIntPipe) id: number, @Request() request: RequestWithUser) {
    return this.projectsService.getOneUserProjects(id, request.user);
  }


  @Patch(':project_id')
  @ProjectPermissions(Permission.MANAGE_PROJECT)
  @ApiOperation({ summary: 'Редактирование проекта по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  update(@Param('project_id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto, @Request() request: RequestWithAccess) {
    return this.projectsService.update(id, updateProjectDto, request);
  }

  @Delete(':project_id')
  @ProjectPermissions(Permission.MANAGE_PROJECT)
  @ApiOperation({ summary: 'Удаление проекта id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  remove(@Param('project_id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.projectsService.delete(+id, request);
  }
}
