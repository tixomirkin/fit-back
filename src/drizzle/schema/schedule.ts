import {integer, pgTable, varchar, timestamp, serial, smallint} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {projectsTable} from "./projects";
import {trainersTable} from "./trainers";
import {registrationsTable} from "./registrations";


export const scheduleTable = pgTable("schedule", {
    projectId: integer().notNull(),
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    trainerId: integer(),
    seats: smallint(),
    // defaultPrice: smallint(),
    color: varchar({ length: 7 }),
    icon: smallint(),
    description: varchar({ length: 255 }),

    startDate: timestamp().notNull(),
    endDate: timestamp().notNull(),

    createdAt: timestamp().defaultNow(),
});

export const scheduleRelations = relations(scheduleTable, ({ one, many }) => ({
    project: one(projectsTable, {
        fields: [scheduleTable.projectId],
        references: [projectsTable.id]
    }),
    trainer: one(trainersTable, {
        fields: [scheduleTable.trainerId],
        references: [trainersTable.id]
    }),
    registrations: many(registrationsTable)
}))