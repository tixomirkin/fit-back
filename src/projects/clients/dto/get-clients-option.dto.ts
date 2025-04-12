import {Order} from "../../../common/utils/pagination.utils";
import {IsEnum, IsOptional} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {PageOptionsDto} from "../../../common/utils/page-options.dto";

enum OrderBy {
    id = 'id',
    name = 'name',
    innerName = 'innerName',
    description = 'description',
    createdAt = 'createdAt',
}

export class GetClientsOptionDto extends PageOptionsDto {
    @ApiPropertyOptional({ enum: OrderBy, default: OrderBy.id })
    @IsOptional()
    @IsEnum(OrderBy)
    orderBy: OrderBy = OrderBy.id;
}