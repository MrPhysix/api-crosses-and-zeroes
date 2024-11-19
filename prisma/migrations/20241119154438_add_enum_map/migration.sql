/*
  Warnings:

  - The values [InProgress,Player1Wins,Player2Wins,Draw] on the enum `WinnerStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WinnerStatus_new" AS ENUM ('0', '1', '2', '3');
ALTER TABLE "GameState" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "GameState" ALTER COLUMN "status" TYPE "WinnerStatus_new" USING ("status"::text::"WinnerStatus_new");
ALTER TYPE "WinnerStatus" RENAME TO "WinnerStatus_old";
ALTER TYPE "WinnerStatus_new" RENAME TO "WinnerStatus";
DROP TYPE "WinnerStatus_old";
ALTER TABLE "GameState" ALTER COLUMN "status" SET DEFAULT '0';
COMMIT;

-- AlterTable
ALTER TABLE "GameState" ALTER COLUMN "status" SET DEFAULT '0';
