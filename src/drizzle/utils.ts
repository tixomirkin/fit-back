import {PgSelect, PgTable} from "drizzle-orm/pg-core";
import {Order} from "../common/utils/pagination.utils";
import {asc, count, desc, sql} from "drizzle-orm";
import {clientsTable} from "./schema";
import {PageOptionsDto} from "../common/utils/page-options.dto";
import {PageMetaDto} from "../common/utils/pageMeta.dto";


export async function queryWithPagination<T extends PgSelect>(
    qb: T,
    pageOptionsDto: PageOptionsDto,
    table: PgTable
) {


    if (pageOptionsDto.order == Order.ASC) {
        qb = qb.orderBy(asc(table[pageOptionsDto.orderBy])).limit(pageOptionsDto.take).offset(pageOptionsDto.skip);
    }
    else {
        qb = qb.orderBy(desc(table[pageOptionsDto.orderBy])).limit(pageOptionsDto.take).offset(pageOptionsDto.skip);
    }


    const result = await qb;

    // @ts-ignore
    qb.config.fields = { count: count() };
    // @ts-ignore
    qb.config.orderBy = [];
    // @ts-ignore
    qb.config.limit = undefined
    // @ts-ignore
    qb.config.offset = undefined
    // @ts-ignore
    const [total] = await qb;

    return {
        data: result,
        meta: new PageMetaDto(pageOptionsDto, total.count)
    }
}