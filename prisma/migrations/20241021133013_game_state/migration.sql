/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Move` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_gameId_fkey";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "Move";

-- CreateTable
CREATE TABLE "GameState" (
    "id" SERIAL NOT NULL,
    "history" JSONB NOT NULL,
    "isGameOver" BOOLEAN NOT NULL DEFAULT false,
    "isHistoryUsed" BOOLEAN NOT NULL DEFAULT false,
    "move" INTEGER NOT NULL DEFAULT 0,
    "winner" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);
