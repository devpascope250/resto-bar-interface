/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `partner` ADD COLUMN `apiKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Partner_apiKey_key` ON `Partner`(`apiKey`);
