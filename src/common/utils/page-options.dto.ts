import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsEnum, IsNumber, IsOptional, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {Order} from "./pagination.utils";

export class PageOptionsDto {
    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(50)
    take: number = 10;

    @ApiPropertyOptional({ enum: Order, default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    order: Order = Order.ASC;

    @IsOptional()
    orderBy: string;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}