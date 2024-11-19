/*
  Warnings:

  - You are about to drop the column `move` on the `GameState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "move",
ADD COLUMN     "currentMove" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "isGameOver" DROP NOT NULL;
