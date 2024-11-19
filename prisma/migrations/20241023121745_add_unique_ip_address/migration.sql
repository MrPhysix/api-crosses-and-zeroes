/*
  Warnings:

  - You are about to drop the column `history` on the `GameState` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ipAdress]` on the table `GameState` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ipAdress` on table `GameState` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "history",
ALTER COLUMN "ipAdress" SET NOT NULL;

-- CreateTable
CREATE TABLE "HistoryStep" (
    "id" SERIAL NOT NULL,
    "playerMoved" BOOLEAN NOT NULL,
    "sections" JSONB NOT NULL,
    "gameStateId" INTEGER,

    CONSTRAINT "HistoryStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameState_ipAdress_key" ON "GameState"("ipAdress");

-- AddForeignKey
ALTER TABLE "HistoryStep" ADD CONSTRAINT "HistoryStep_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "GameState"("id") ON DELETE SET NULL ON UPDATE CASCADE;
