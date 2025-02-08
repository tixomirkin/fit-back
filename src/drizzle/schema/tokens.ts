import {pgEnum, pgTable, serial, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export const tokenType = pgEnum("token_type", ['VERIFICATION', 'TWO-FACTOR', 'PASSWORD-RESET'])


export const tokensTable = pgTable("tokens", {
    id: serial().primaryKey(),
    userId: uuid(),

    email: varchar({length: 255}),
    token: varchar({length: 255}).unique(),

    type: tokenType(),
    expiresIn: timestamp(),
})
