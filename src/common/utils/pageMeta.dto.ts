import {ApiProperty} from "@nestjs/swagger";
import {PageOptionsDto} from "./page-options.dto";



export class PageMetaDto {
    @ApiProperty({default: 1})
    readonly page: number;

    @ApiProperty({default: 10})
    readonly take: number;

    @ApiProperty({default: 20})
    readonly itemCount: number;

    @ApiProperty({default: 2})
    readonly pageCount: number;

    @ApiProperty({default: false})
    readonly hasPreviousPage: boolean;

    @ApiProperty({default: true})
    readonly hasNextPage: boolean;

    constructor( pageOptionsDto: PageOptionsDto, itemCount: number ) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}