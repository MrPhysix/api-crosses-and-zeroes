-- DropForeignKey
ALTER TABLE "HistoryStep" DROP CONSTRAINT "HistoryStep_gameStateId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_historyStepId_fkey";

-- AddForeignKey
ALTER TABLE "HistoryStep" ADD CONSTRAINT "HistoryStep_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "GameState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_historyStepId_fkey" FOREIGN KEY ("historyStepId") REFERENCES "HistoryStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
