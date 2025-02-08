import { integer, pgTable, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {projectsTable} from "./projects";

export const trainersTable = pgTable("trainers", {
    projectId: integer().notNull(),
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    customerName: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    typeTrainer: varchar({ length: 255 }),

    createdAt: timestamp().defaultNow(),
});

export const trainersRelations = relations(trainersTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [trainersTable.projectId],
        references: [projectsTable.id]
    })
}))