import { Transaction } from "kysely";
import { kyselyDb } from "./Connection";
import { HttpError } from "@/Utils/HttpError";
import { DB } from "./Generated/Kysely";

export const Clientes = {
	async getBase(id: number, trx?: Transaction<DB>) {
		const cliente = await (trx ?? kyselyDb)
			.selectFrom("clientes as c")
			.where("id", "=", id)
			.select(["c.saldo", "c.limite"])
			.executeTakeFirst();

		if (!cliente) throw new HttpError(404, "Cliente não encontrado");

		return cliente;
	},
};
