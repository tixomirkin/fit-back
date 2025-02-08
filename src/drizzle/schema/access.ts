import {integer, pgTable, varchar, timestamp, json, primaryKey, serial} from "drizzle-orm/pg-core";
import {roleEnum} from "./roles";
import {usersTable} from "./users";
import {relations} from "drizzle-orm";
import {projectsTable} from "./projects";
import {Permissions} from "../../permissions/permission-enum";

export const accessTable = pgTable("access", {
    id: serial().primaryKey(),
    userId: varchar({length: 255}).notNull(),
    projectId: integer(),
    trainerId: integer(),
    permissions: json().$type<Permissions>().notNull().default({
        MANAGE_PROJECT: false,

        MANAGE_USERS: false,
        MANAGE_TRAINERS: false,
        MANAGE_SCHEDULES: true,

        VIEW_CLIENTS: true,
        ADD_CLIENTS: true,
        EDIT_CLIENTS: false,
        DELETE_CLIENT: false,
    }),
    role: roleEnum().notNull(),

    createdAt: timestamp().defaultNow(),
// }, (table) => {
//     return {
//         pk: primaryKey({columns: [table.userId, table.projectId]}),
//     }
});

export const accessRelations = relations(accessTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [accessTable.userId],
        references: [usersTable.id],
    }),
    project: one(projectsTable, {
        fields: [accessTable.projectId],
        references: [projectsTable.id]
    })
}));