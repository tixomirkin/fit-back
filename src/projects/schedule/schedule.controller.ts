import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseDatePipe,
  Query,
  ParseIntPipe,
  Request, BadRequestException
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {ProjectPermissions} from "../../permissions/permissions.decorator";
import {Permission} from "../../permissions/permission-enum";
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";

@ApiTags("Schedule - Расписание")
@ApiBearerAuth()
@Controller('projects/:project_id/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Создание события' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @Post()
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  create(@Body() createScheduleDto: CreateScheduleDto, @Request() request: RequestWithAccess) {
    if (createScheduleDto.startDate >= createScheduleDto.endDate) throw new BadRequestException('Дата начала не может быть позже ири равно концу')
    return this.scheduleService.create(createScheduleDto, request);
  }

  @ApiOperation({ summary: 'Получение списка событий в диапазоне' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiQuery({name: 'start_date', required: true, description: 'Начало диапазона (ISO 8601)', type: 'string', format: "date", example: "2025-02-06" })
  @ApiQuery({name: 'end_date', required: true, description: 'Конец диапазона (ISO 8601)', type: 'string', format: "date", example: "2025-02-07" })
  @Get()
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  getByDay(@Query('start_date', new ParseDatePipe()) startDate: Date, @Query('end_date', new ParseDatePipe()) endDate: Date, @Request() request: RequestWithAccess) {
    return this.scheduleService.findAll(startDate, endDate, request);
  }

  @ApiOperation({ summary: 'Получение события по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiParam({name: 'id', required: true, description: 'id события'})
  @Get(':id')
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  getById(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.scheduleService.findOne(id, request);
  }

  @ApiOperation({ summary: 'Редактирование события по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiParam({name: 'id', required: true, description: 'id события'})
  @Patch(':id')
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateScheduleDto: UpdateScheduleDto, @Request() request: RequestWithAccess) {
    return this.scheduleService.update(id, updateScheduleDto, request);
  }

  @ApiOperation({ summary: 'Получение события по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiParam({name: 'id', required: true, description: 'id события'})
  @Delete(':id')
  @ProjectPermissions(Permission.MANAGE_SCHEDULES)
  remove(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.scheduleService.remove(id, request);
  }
}
