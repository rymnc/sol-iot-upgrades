/*
  Warnings:

  - You are about to alter the column `ip` on the `LoginHistory` table. The data in that column could be lost. The data in that column will be cast from `Inet` to `Unsupported("inet")`.
  - A unique constraint covering the columns `[token]` on the table `LoginHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LoginHistory" ALTER COLUMN "ip" SET DATA TYPE inet;

-- CreateIndex
CREATE UNIQUE INDEX "LoginHistory.token_unique" ON "LoginHistory"("token");
