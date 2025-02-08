import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())

export default defineConfig({
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URI!,
        // url: "postgres://tixomirkin@localhost/tixomirkin",
    },
    casing: 'snake_case',
    schema: './src/drizzle/schema'
})