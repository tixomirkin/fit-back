import {CreateClientDto} from "./create-client.dto";
import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class PublicClientDto extends PartialType(CreateClientDto) {
    @ApiProperty({
        description: 'id клиента',
        default: "1314",
    })
    @IsNumber()
    id: number;
}