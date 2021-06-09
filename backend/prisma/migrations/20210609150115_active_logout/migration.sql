/*
  Warnings:

  - You are about to alter the column `ip` on the `LoginHistory` table. The data in that column could be lost. The data in that column will be cast from `Inet` to `Unsupported("inet")`.
  - Added the required column `active` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginHistory" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "logoutAt" TIMESTAMP(3),
ALTER COLUMN "ip" SET DATA TYPE inet;
