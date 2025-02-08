import {ApiProperty} from "@nestjs/swagger";
import {IsHexColor, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";

export class CreateTypeTrainingDto {
    @ApiProperty({
        description: 'Название типа',
        default: "Стрейчинг",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    name: string;

    @ApiProperty({
        description: 'id тренера по умолчанию',
        default: null,
        minimum: 0,
        type: 'number'
    })
    @Min(0)
    @IsNumber()
    @IsOptional()
    defaultTrainerId?: number;

    @ApiProperty({
        description: 'Количество мест по умолчанию',
        default: 6,
        minimum: 0,
        type: 'number'
    })
    @Min(0)
    @IsNumber()
    @IsOptional()
    defaultSeats?: number;

    @ApiProperty({
        description: 'Цвет по умолчанию',
        default: "#00A3F5",
    })
    @IsOptional()
    @IsHexColor()
    defaultColor?: string;

    @ApiProperty({
        description: 'Описание тренировки по умолчанию',
        default: "Стрейчинг - это пиздато",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    defaultDescription?: string;
}
