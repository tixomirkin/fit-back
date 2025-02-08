import {integer, pgTable, varchar, timestamp, serial, boolean, uuid} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {accessTable} from "./access";
import {projectsTable} from "./projects";

import {pgEnum} from "drizzle-orm/pg-core";
import {accountsTable} from "./accounts";

export const authMethod = pgEnum("auth_method", ['CREDENTIALS', 'GOOGLE', 'YANDEX'])


export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    // username: varchar("username", {length: 64}).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),

    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar({ length: 255 }),
    // age: integer().notNull(),

    passwordHash: varchar({ length: 255 }),

    authMethod: authMethod().default("CREDENTIALS"),

    isVerified: boolean("is_verified").default(false),
    isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),

    createdAt: timestamp().defaultNow(),
});


export const usersRelations = relations(usersTable, ({ one, many }) => ({
    access: many(accessTable),
    accounts: many(accountsTable)
}))


