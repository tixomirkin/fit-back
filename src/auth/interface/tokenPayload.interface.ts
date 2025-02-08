import {usersTable} from "../../drizzle/schema";

export interface TokenPayload {
    userId: typeof usersTable.id | string;
}