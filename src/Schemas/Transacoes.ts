import { tipo_transacao } from "@/Database/Generated/Kysely";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { t } from "elysia";

const addTransaçãoBody = t.Object({
	valor: t.Integer(),
	tipo: t.Enum(tipo_transacao),
	descricao: t.String({
		minLength: 1,
		maxLength: 10,
	}),
});

export const transacaoChecker = TypeCompiler.Compile(addTransaçãoBody);
