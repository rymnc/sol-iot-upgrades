/*
  Warnings:

  - You are about to alter the column `ip` on the `LoginHistory` table. The data in that column could be lost. The data in that column will be cast from `Inet` to `Unsupported("inet")`.

*/
-- AlterTable
ALTER TABLE "LoginHistory" ALTER COLUMN "ip" SET DATA TYPE inet;
