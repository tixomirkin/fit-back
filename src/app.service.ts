import {Inject, Injectable} from '@nestjs/common';
import {NodePgDatabase, NodePgClient, drizzle} from "drizzle-orm/node-postgres";
import {DrizzleAsyncProvider} from "./drizzle/drizzle.provider";
import * as schema from './drizzle/schema';
import {AuthService} from "./auth/auth.service";
import {clientsTable, usersTable} from "./drizzle/schema";

type dbb = NodePgDatabase<Record<string, never>> & { $client: NodePgClient }


@Injectable()
export class AppService {
  constructor(@Inject(DrizzleAsyncProvider)
              private db: dbb,
              // private db: NodePgDatabase<typeof schema>,
              private authService: AuthService,) {
  }

  async getHello() {
    // await this.authService.createUser("saaaaa)))s", "223dddd");
    const [users] = await this.db.select().from(schema.usersTable);

    // db2.insert(usersTable).values({firstName: "asa", })

    // const s = await this.authService.hashPassword("dgahgdhasd");
    // console.log(await this.authService.validateUser())
    return users;
  }
}
