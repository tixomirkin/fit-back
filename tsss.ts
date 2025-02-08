// import {drizzle} from "drizzle-orm/node-postgres";
// import {usersTable} from "./src/schema";
// import * as schema from "./src/schema";
//
// const db = drizzle("postgres://tixomirkin@localhost/tixomirkin", { schema , casing: 'snake_case'});
//
//
// async function run() {
//     await db.insert(usersTable).values({ email: "sadas", password_hash: "sad", username: "sadaaaaaasa", firstName: "jsanjdn"})
// }
//
// run()
// require('dotenv').config();
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
console.log(process.env.POSTGRES_URI);