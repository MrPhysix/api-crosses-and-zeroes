/*
  Warnings:

  - Changed the type of `ipAdress` on the `GameState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "ipAdress",
ADD COLUMN     "ipAdress" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameState_ipAdress_key" ON "GameState"("ipAdress");
