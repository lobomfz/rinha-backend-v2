import { Elysia } from "elysia";
import { Transacoes } from "./Database/Transacoes";
import { transacaoChecker } from "./Schemas/Transacoes";
import { HttpError } from "./Utils/HttpError";

new Elysia()
	.onError(({ error, set }) => {
		if (error instanceof HttpError) {
			set.status = error.status;
		}
		return "";
	})
	.get("/clientes/:id/extrato", async ({ params: { id }, set }) => {
		const res = await Transacoes.getExtrato(Number(id));

		if (typeof res === "number") {
			set.status = res;
			return "";
		}

		return res;
	})
	.post("/clientes/:id/transacoes", ({ params: { id }, body, set }) => {
		// Não da pra usar a validação nativa do elysia pq sempre retorna 400
		const success = transacaoChecker.Check(body);

		if (!success) {
			set.status = 422;
			return "";
		}

		return Transacoes.add({
			id_cliente: Number(id),
			valor: body.valor,
			tipo: body.tipo,
			descricao: body.descricao,
		});
	})
	.listen(3000);
