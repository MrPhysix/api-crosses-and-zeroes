/*
  Warnings:

  - A unique constraint covering the columns `[ipAdress]` on the table `GameState` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameState_ipAdress_key" ON "GameState"("ipAdress");
