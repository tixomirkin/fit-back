import {integer, pgTable, varchar, timestamp, serial, smallint} from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";
import {projectsTable} from "./projects";
import {trainersTable} from "./trainers";


export const typeTrainingTable = pgTable("type_training", {
    projectId: integer().notNull(),
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    defaultTrainerId: integer(),
    defaultSeats: smallint(),
    // defaultPrice: smallint(),
    defaultColor: varchar({ length: 7 }),
    defaultIcon: smallint(),
    defaultDescription: varchar({ length: 255 }),

    createdAt: timestamp().defaultNow(),
});

export const typeTrainingRelations = relations(typeTrainingTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [typeTrainingTable.projectId],
        references: [projectsTable.id]
    }),
    trainer: one(trainersTable, {
        fields: [typeTrainingTable.defaultTrainerId],
        references: [trainersTable.id]
    })
}))