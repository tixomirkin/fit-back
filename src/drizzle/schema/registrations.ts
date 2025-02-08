import {integer, pgTable, varchar, timestamp, serial, boolean} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {projectsTable} from "./projects";
import {clientsTable} from "./clients";
import {scheduleTable} from "./schedule";

export const registrationsTable = pgTable("registrations", {
    id: serial().primaryKey(),
    projectId: integer().notNull(),
    clientId: integer().notNull(),
    scheduleId: integer().notNull(),
    isVisit: boolean().default(false).notNull(),
    isPayed: boolean().default(false).notNull(),

    createdAt: timestamp().defaultNow(),
});

export const registrationsRelations = relations(registrationsTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [registrationsTable.projectId],
        references: [projectsTable.id]
    }),
    client: one(clientsTable, {
        fields: [registrationsTable.clientId],
        references: [clientsTable.id]
    }),
    schedule: one(scheduleTable, {
        fields: [registrationsTable.scheduleId],
        references: [scheduleTable.id]
    })
}))