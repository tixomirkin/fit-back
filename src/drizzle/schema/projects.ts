import {integer, pgTable, timestamp, varchar, serial} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {accessTable} from "./access";
import {trainersTable} from "./trainers";
import {clientsTable} from "./clients";
import {typeTrainingTable} from "./type_trainigs";

export const projectsTable = pgTable("projects", {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    address: varchar({ length: 255 }),
    slug: varchar({ length: 255 }).unique(),

    createdAt: timestamp().defaultNow(),
});

export const projectRelations = relations(projectsTable, ({ one, many }) => ({
    access: many(accessTable),
    trainers: many(trainersTable),
    clients: many(clientsTable),
    typeTrainings: many(typeTrainingTable),
}))