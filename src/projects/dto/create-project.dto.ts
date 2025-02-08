import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateProjectDto {
    @ApiProperty({
        description: 'Name of the project',
        default: "Best Project Name",
        minLength: 3,
        maxLength: 64
    })
    @Length(3, 64)
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Public description of the project',
        default: "Bla bla bla",
        minLength: 3,
        maxLength: 128
    })
    @Length(3, 128)
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Public address of the project',
        default: "Улица Горького, дом 1",
        minLength: 3,
        maxLength: 128
    })
    @Length(3, 128)
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({
        description: 'Short url of the project',
        default: "best_project_url",
        minLength: 3,
        maxLength: 64
    })
    @IsOptional()
    @IsString()
    slug?: string

}
