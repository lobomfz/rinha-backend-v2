import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const tipo_transacao = {
    c: "c",
    d: "d"
} as const;
export type tipo_transacao = (typeof tipo_transacao)[keyof typeof tipo_transacao];
export type clientes = {
    id: Generated<number>;
    saldo: number;
    limite: number;
};
export type transacoes = {
    id: Generated<number>;
    valor: number;
    id_cliente: number;
    tipo: tipo_transacao;
    descricao: string;
    realizada_em: Generated<Timestamp>;
};
export type DB = {
    clientes: clientes;
    transacoes: transacoes;
};
