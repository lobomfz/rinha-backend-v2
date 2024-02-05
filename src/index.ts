import { Elysia } from "elysia";
import { Transacoes } from "./Database/Transacoes";
import { transacaoChecker } from "./Schemas/Transacoes";
import { HttpError } from "./Utils/HttpError";

const app = new Elysia()
	.onError(({ code, error, set }) => {
		if (error instanceof HttpError) {
			set.status = error.status;
		}
		return "";
	})
	.get("/clientes/:id/extrato", ({ params: { id } }) =>
		Transacoes.getExtrato(Number(id)),
	)
	.post("/clientes/:id/transacoes", ({ params: { id }, body }) => {
		// Não da pra usar a validação nativa do elysia pq sempre retorna 400
		const success = transacaoChecker.Check(body);

		if (!success) {
			throw new HttpError(422, "");
		}

		return Transacoes.add({
			id_cliente: Number(id),
			valor: body.valor,
			tipo: body.tipo,
			descricao: body.descricao,
		});
	})
	.listen(3000);
