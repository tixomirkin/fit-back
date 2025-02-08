import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import {IsNumber} from "class-validator";

export class PublicProjectDto extends PartialType(CreateProjectDto) {
    @ApiProperty({
        description: 'Id of the project',
        default: "1314",
    })
    @IsNumber()
    id: number;
}
