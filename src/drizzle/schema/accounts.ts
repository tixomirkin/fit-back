import {pgTable, serial, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {usersTable} from "./users";

export const accountsTable = pgTable("accounts", {
    id: serial().primaryKey(),
    userId: varchar({length: 255}).notNull(),

    type: varchar({ length: 255 }).notNull(),
    provider: varchar({ length: 255 }).notNull(),

    refreshToken: varchar({ length: 255 }),
    accessToken: varchar({ length: 255 }),
    expiresAt: timestamp(),
})


export const accountsRelations = relations(accountsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [accountsTable.userId],
        references: [usersTable.id],
    })
}));