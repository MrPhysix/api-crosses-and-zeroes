/*
  Warnings:

  - You are about to drop the column `isGameOver` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `isHistoryUsed` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `GameState` table. All the data in the column will be lost.
  - Made the column `gameStateId` on table `HistoryStep` required. This step will fail if there are existing NULL values in that column.
  - Made the column `historyStepId` on table `Section` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WinnerStatus" AS ENUM ('InProgress', 'Player1Wins', 'Player2Wins', 'Draw');

-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "isGameOver",
DROP COLUMN "isHistoryUsed",
DROP COLUMN "winner",
ADD COLUMN     "status" "WinnerStatus" NOT NULL DEFAULT 'InProgress';

-- AlterTable
ALTER TABLE "HistoryStep" ALTER COLUMN "gameStateId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "historyStepId" SET NOT NULL;
