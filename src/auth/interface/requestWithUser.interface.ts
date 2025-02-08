import { Request } from 'express';
import {usersTable} from "../../drizzle/schema";

interface RequestWithUser extends Request {
    user: typeof usersTable;
}

export default RequestWithUser;