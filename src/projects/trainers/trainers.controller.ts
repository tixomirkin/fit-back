import {Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import {Auth} from "../../auth/auth.decorator";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import RequestWithUser from "../../auth/interface/requestWithUser.interface";
import {ProjectPermissions} from "../../permissions/permissions.decorator";
import {Permission} from "../../permissions/permission-enum";
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";

@ApiTags("Trainers - Тренеры")
@ApiBearerAuth()
@Controller('projects/:project_id/trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @ApiOperation({ summary: 'Создание тренера в проекте' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_TRAINERS)
  @Post()
  create(@Param('project_id') id: string, @Body() createTrainerDto: CreateTrainerDto, @Request() request: RequestWithAccess) {
    return this.trainersService.create(createTrainerDto, request);
  }

  @ApiOperation({ summary: 'Получение списка тренеров в проекте' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_TRAINERS)
  @Get()
  findAll(@Param('project_id') id: number, @Request() request: RequestWithAccess) {
    return this.trainersService.findAll(request);
  }

  @ApiOperation({ summary: 'Получение тренера по id' })
  @ApiParam({name: 'id', required: true, description: 'id тренера'})
  @ProjectPermissions(Permission.MANAGE_TRAINERS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.trainersService.findOne(id, request);
  }

  @ApiOperation({ summary: 'Редактирование тренера по id' })
  @ApiParam({name: 'id', required: true, description: 'id тренера'})
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_TRAINERS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTrainerDto: UpdateTrainerDto, @Request() request: RequestWithAccess) {
    return this.trainersService.update(id, updateTrainerDto, request);
  }

  @ApiOperation({ summary: 'Удаление тренера по id' })
  @ApiParam({name: 'id', required: true, description: 'id тренера'})
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.MANAGE_TRAINERS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.trainersService.remove(id, request);
  }
}
