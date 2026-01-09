/*
  Warnings:

  - Added the required column `currency` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `packages` ADD COLUMN `currency` ENUM('RWF', 'USD', 'EUR', 'UGX', 'KES', 'TZS') NOT NULL;
