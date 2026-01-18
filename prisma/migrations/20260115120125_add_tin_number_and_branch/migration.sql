/*
  Warnings:

  - A unique constraint covering the columns `[tinNumber,bhfId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Partner_contactEmail_key` ON `partner`;

-- DropIndex
DROP INDEX `Partner_tinNumber_key` ON `partner`;

-- AlterTable
ALTER TABLE `partner` ADD COLUMN `bhfId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Partner_tinNumber_bhfId_key` ON `Partner`(`tinNumber`, `bhfId`);
