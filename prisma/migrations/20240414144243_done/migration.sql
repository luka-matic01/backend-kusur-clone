/*
  Warnings:

  - A unique constraint covering the columns `[walletId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `walletId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pointBalance` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TenantWallet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TenantWallet_AB_unique`(`A`, `B`),
    INDEX `_TenantWallet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_walletId_key` ON `User`(`walletId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TenantWallet` ADD CONSTRAINT `_TenantWallet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TenantWallet` ADD CONSTRAINT `_TenantWallet_B_fkey` FOREIGN KEY (`B`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
