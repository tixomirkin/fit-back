import {Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe, Query} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import {ProjectPermissions} from "../../permissions/permissions.decorator";
import {Permission} from "../../permissions/permission-enum";
import RequestWithAccess from "../../permissions/requestWithAccess.interfce";
import {clientsTable} from "../../drizzle/schema";
import {GetClientsOptionDto} from "./dto/get-clients-option.dto";
import {ApiOkResponsePaginated} from "../../common/utils/pagination.utils";
import {PublicClientDto} from "./dto/public-client.dto";

@ApiTags("Clients - Клиенты")
@ApiBearerAuth()
@Controller('projects/:project_id/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ProjectPermissions(Permission.ADD_CLIENTS)
  // @ApiResponse({ status: 200, description: 'Successful response', type: GetPublicClientsDto })
  @ApiOperation({ summary: 'Создание клиента в проекте' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  create(@Body() createClientDto: CreateClientDto, @Request() request: RequestWithAccess) {
    return this.clientsService.create(createClientDto, request);
  }

  @Get()
  @ApiOperation({ summary: 'Получение списка клиентов в проекте' })
  @ApiOkResponsePaginated(PublicClientDto)
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ProjectPermissions(Permission.VIEW_CLIENTS)
  findAll(
      @Query() pageOptionsDto: GetClientsOptionDto,
      @Request() request: RequestWithAccess
  ) {
    return this.clientsService.findAll(request, pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение клиента по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiParam({name: 'id', required: true, description: 'id клиента'})
  @ProjectPermissions(Permission.VIEW_CLIENTS)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.clientsService.findOne(id, request);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Редактирование клиента по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiParam({name: 'id', required: true, description: 'id клиента'})
  @ProjectPermissions(Permission.EDIT_CLIENTS)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto, @Request() request: RequestWithAccess) {
    return this.clientsService.update(id, updateClientDto, request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление клиента по id' })
  @ApiParam({name: 'project_id', required: true, description: 'id проекта'})
  @ApiParam({name: 'id', required: true, description: 'id клиента'})
  @ProjectPermissions(Permission.DELETE_CLIENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() request: RequestWithAccess) {
    return this.clientsService.remove(id, request);
  }
}
