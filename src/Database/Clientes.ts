import { Transaction } from "kysely";
import { kyselyDb } from "./Connection";
import { HttpError } from "@/Utils/HttpError";
import { DB } from "./Generated/Kysely";

export const Clientes = {
	getBase(id: number, trx?: Transaction<DB>) {
		return (trx ?? kyselyDb)
			.selectFrom("clientes as c")
			.where("id", "=", id)
			.select(["c.saldo", "c.limite"])
			.executeTakeFirst();
	},
};
