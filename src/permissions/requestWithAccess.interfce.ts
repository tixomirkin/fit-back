import { Request } from 'express';
import {accessTable, projectsTable, usersTable} from "../drizzle/schema";

interface RequestWithAccess extends Request {
    user: typeof usersTable.$inferSelect;
    project: typeof projectsTable.$inferSelect,
    access: typeof  accessTable.$inferSelect
}

export default RequestWithAccess;