import { Transaction, sql } from "kysely";
import { kyselyDb } from "./Connection";
import { HttpError } from "@/Utils/HttpError";

export const Transacoes = {
	async add(data: {
		id_cliente: number;
		valor: number;
		tipo: "c" | "d";
		descricao: string;
	}) {
		return await kyselyDb.transaction().execute(async (trx) => {
			const { saldo, limite } = await trx
				.updateTable("clientes as c")
				.set(
					"saldo",
					sql`saldo + ${data.tipo === "c" ? data.valor : -data.valor}`
				)
				.where("c.id", "=", data.id_cliente)
				.returning(["c.saldo", "c.limite"])
				.executeTakeFirstOrThrow();

			if (data.tipo === "d" && saldo < -limite) {
				throw new HttpError(422, "Saldo insuficiente");
			}

			await trx.insertInto("transacoes").values(data).execute();

			return { saldo, limite };
		});
	},

	async getExtrato(id_cliente: number) {
		const saldo = await kyselyDb
			.selectFrom("clientes as c")
			.where("c.id", "=", id_cliente)
			.select(["c.saldo as total", "c.limite", sql`NOW()`.as("data_extrato")])
			.executeTakeFirst();

		if (saldo == null) {
			return 404;
		}

		const ultimas_transacoes = await kyselyDb
			.selectFrom("transacoes as t")
			.where("t.id_cliente", "=", id_cliente)
			.select(["t.valor", "t.tipo", "t.descricao", "t.realizada_em"])
			.orderBy("t.realizada_em", "desc")
			.limit(10)
			.execute();

		return {
			saldo,
			ultimas_transacoes,
		};
	},
};
