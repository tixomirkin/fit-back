import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString, Length} from "class-validator";

export class CreateClientDto {
    @ApiProperty({
        description: 'Имя клиента',
        default: "Владислав",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Внутриннее имя клиента',
        default: "Владос2004",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    innerName?: string;

    @ApiProperty({
        description: 'Внутринняя заметка по клиенту',
        default: "Лох какой-то",
        minLength: 3,
        maxLength: 255
    })
    @Length(3, 255)
    @IsString()
    @IsOptional()
    description?: string;


}
