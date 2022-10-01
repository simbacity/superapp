/*
  Warnings:

  - You are about to drop the column `createAt` on the `MessageThread_TownSquare` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messageId]` on the table `MessageThread_TownSquare` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `MessageThread_TownSquare` DROP COLUMN `createAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `MessageThread_TownSquare_messageId_key` ON `MessageThread_TownSquare`(`messageId`);
