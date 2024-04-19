/*
  Warnings:

  - Added the required column `currency` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `discountTypeId` INTEGER NULL,
    ADD COLUMN `discountValue` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `voucher` ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `discountTypeId` INTEGER NULL,
    ADD COLUMN `discountValue` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `DiscountType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_discountTypeId_fkey` FOREIGN KEY (`discountTypeId`) REFERENCES `DiscountType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voucher` ADD CONSTRAINT `Voucher_discountTypeId_fkey` FOREIGN KEY (`discountTypeId`) REFERENCES `DiscountType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
