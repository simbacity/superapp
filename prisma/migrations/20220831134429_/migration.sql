/*
  Warnings:

  - Added the required column `status` to the `Post_Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post_Todo` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `priority` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
