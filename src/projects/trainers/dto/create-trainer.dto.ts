import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, Length} from "class-validator";

export class CreateTrainerDto {
    @ApiProperty({
        description: 'Имя тренера',
        default: "Ангелина Иванова",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Внутриннее имя тренера',
        default: "Геля",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    customerName?: string;

    @ApiProperty({
        description: 'Описание тренера',
        default: "Лучший тренер в истории",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Направления тренера',
        default: "Пилатес, Йога, Танцы",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    typeTrainer?: string;
}
