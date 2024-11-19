/*
  Warnings:

  - You are about to drop the column `sections` on the `HistoryStep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoryStep" DROP COLUMN "sections";

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "value" BOOLEAN,
    "historyStepId" INTEGER,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_historyStepId_fkey" FOREIGN KEY ("historyStepId") REFERENCES "HistoryStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;
