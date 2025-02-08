import {pgEnum} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ['trainer', 'user', 'client', 'admin', 'owner'])
