-- CreateEnum
CREATE TYPE "tipo_transacao" AS ENUM ('c', 'd');

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "saldo" INTEGER NOT NULL,
    "limite" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" SERIAL NOT NULL,
    "valor" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "tipo" "tipo_transacao" NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,
    "realizada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DO $$
BEGIN
	INSERT INTO clientes (saldo, limite)
	VALUES
		(0, 1000 * 100),
		(0, 800 * 100),
		(0, 10000 * 100),
		(0, 100000 * 100),
		(0, 5000 * 100);
END;
$$;

