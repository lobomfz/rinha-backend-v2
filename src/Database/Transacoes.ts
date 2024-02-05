import { Transaction, sql } from "kysely";
import { kyselyDb } from "./Connection";
import { DB } from "./Generated/Kysely";
import { Clientes } from "./Clientes";
import { HttpError } from "../Utils/HttpError";

export const Transacoes = {
	async add(data: {
		id_cliente: number;
		valor: number;
		tipo: "c" | "d";
		descricao: string;
	}) {
		return await kyselyDb.transaction().execute(async (trx) => {
			const { saldo, limite } = await Clientes.getBase(
				data.id_cliente,
				trx,
			);

			if (data.tipo === "d" && saldo - data.valor < -limite) {
				throw new HttpError(422, "Limite de saldo excedido");
			}

			const [{ saldo: novoSaldo }] = await Promise.all([
				trx
					.updateTable("clientes as c")
					.set(
						"saldo",
						sql`saldo + ${
							data.tipo === "c" ? data.valor : -data.valor
						}`,
					)
					.where("c.id", "=", data.id_cliente)
					.returning("c.saldo")
					.executeTakeFirstOrThrow(),
				trx.insertInto("transacoes").values(data).execute(),
			]);

			if (isNaN(novoSaldo) || novoSaldo < -limite) {
				throw new HttpError(422, "Saldo insuficiente");
			}

			return { saldo: novoSaldo, limite };
		});
	},

	async getExtrato(id_cliente: number) {
		const [saldo, ultimas_transacoes] = await kyselyDb
			.transaction()
			.execute((trx) =>
				Promise.all([
					trx
						.selectFrom("clientes as c")
						.where("c.id", "=", id_cliente)
						.select([
							"c.saldo as total",
							"c.limite",
							sql`NOW()`.as("data_extrato"),
						])
						.executeTakeFirst(),
					trx
						.selectFrom("transacoes as t")
						.where("t.id_cliente", "=", id_cliente)
						.select([
							"t.valor",
							"t.tipo",
							"t.descricao",
							"t.realizada_em",
						])
						.orderBy("t.realizada_em", "desc")
						.limit(10)
						.execute(),
				]),
			);

		if (saldo == null) {
			throw new HttpError(404, "");
		}

		return {
			saldo,
			ultimas_transacoes,
		};
	},
};
