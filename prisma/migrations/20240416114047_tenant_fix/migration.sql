/*
  Warnings:

  - You are about to drop the column `description` on the `tenant` table. All the data in the column will be lost.
  - Added the required column `name` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tenant` DROP COLUMN `description`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
