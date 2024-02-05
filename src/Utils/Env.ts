import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";

const envVariablesSchema = t.Object({
	DATABASE_URL: t.String(),
});

export const envVariables = Value.Cast(envVariablesSchema, process.env);
