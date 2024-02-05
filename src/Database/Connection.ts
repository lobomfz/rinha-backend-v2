import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { envVariables } from "@/Utils/Env";
import { DB } from "./Generated/Kysely";

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		connectionString: envVariables.DATABASE_URL,
	}),
});

export const kyselyDb = new Kysely<DB>({
	dialect,
});
