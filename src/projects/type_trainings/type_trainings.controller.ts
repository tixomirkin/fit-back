import {Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe} from '@nestjs/common';
import { TypeTrainingsService } from './type_trainings.service';
import { CreateTypeTrainingDto } from './dto/create-type_training.dto';
import { UpdateTypeTrainingDto } from './dto/update-type_training.dto';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {ProjectPermissions} from "../../permissions/permissions.decorator";
import {Permission} from "../../permissions/permission-enum";
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";

@ApiTags("TypeTrainings - Типы тренировок")
@ApiBearerAuth()
@Controller('projects/:project_id/type-trainings')
export class TypeTrainingsController {
  constructor(private readonly typeTrainingsService: TypeTrainingsService) {}

  @ApiOperation({ summary: 'Создание типа тренировки в проекте' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  @Post()
  create(@Body() createTypeTrainingDto: CreateTypeTrainingDto, @Request() request: RequestWithAccess) {
    return this.typeTrainingsService.create(createTypeTrainingDto, request);
  }

  @ApiOperation({ summary: 'Получение списка типов тренировки в проекте' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  @Get()
  findAll(@Request() request: RequestWithAccess) {
    return this.typeTrainingsService.findAll(request);
  }

  @ApiOperation({ summary: 'Получение типа тренировки по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.typeTrainingsService.findOne(id, request);
  }

  @ApiOperation({ summary: 'Редактирование типа тренировки по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTypeTrainingDto: UpdateTypeTrainingDto, @Request() request: RequestWithAccess) {
    return this.typeTrainingsService.update(id, updateTypeTrainingDto, request);
  }

  @ApiOperation({ summary: 'Удаление типа тренировки по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.typeTrainingsService.remove(id, request);
  }
}
