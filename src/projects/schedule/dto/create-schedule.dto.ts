import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsHexColor, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {Type} from "class-transformer";

export class CreateScheduleDto {
    @ApiProperty({
        description: 'Название события',
        default: "Стрейчинг",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    name: string;

    @ApiProperty({
        description: 'id тренера',
        default: null,
        minimum: 0,
        type: 'number'
    })
    @Min(0)
    @IsNumber()
    @IsOptional()
    trainerId?: number;

    @ApiProperty({
        description: 'Количество мест',
        default: 6,
        minimum: 0,
        type: 'number'
    })
    @Min(0)
    @IsNumber()
    @IsOptional()
    seats?: number;

    @ApiProperty({
        description: 'Цвет',
        default: "#00A3F5",
    })
    @IsOptional()
    @IsHexColor()
    color?: string;

    @ApiProperty({
        description: 'Описание',
        default: "Стрейчинг - это пиздато",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Дата и время начала события',
        default: "2025-02-06T10:00:00+03:00",
    })
    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @ApiProperty({
        description: 'Дата и время конца события',
        default: "2025-02-06T11:00:00+03:00",
    })
    @Type(() => Date)
    @IsDate()
    endDate: Date;

}
