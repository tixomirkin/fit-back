import { integer, pgTable, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {projectsTable} from "./projects";

export const clientsTable = pgTable("clients", {
    projectId: integer().notNull(),
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    innerName: varchar({ length: 255 }),
    description: varchar({ length: 255 }),

    createdAt: timestamp().defaultNow(),
});

export const clientsRelations = relations(clientsTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [clientsTable.projectId],
        references: [projectsTable.id]
    })
}))

// export enum clientTableColumn {
//
// }