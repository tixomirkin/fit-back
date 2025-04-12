import {ApiExtraModels, ApiOkResponse, ApiProperty, ApiPropertyOptional, getSchemaPath} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsEnum, IsNumber, IsOptional, Max, Min} from "class-validator";
import {applyDecorators} from "@nestjs/common";
import {PageMetaDto} from "./pageMeta.dto";



// @ts-ignore
export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
    applyDecorators(
        ApiExtraModels(PageMetaDto, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(dataDto) },
                            },
                        },
                    },

                    {
                        properties: {
                            meta: {
                                $ref: getSchemaPath(PageMetaDto)
                            }
                        }
                    },
                ],
            },
        }),
    )

export class PaginationResponse<T> {
    @ApiProperty()
    data: T[];

    // @ApiProperty()
    // @Expose()
    meta: PageMetaDto
}

export enum Order {
    ASC = 'asc',
    DESC = 'desc',
}

