/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subscription` table. All the data in the column will be lost.
  - Made the column `cycleId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Subscription] DROP CONSTRAINT [Subscription_cycleId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Subscription] DROP CONSTRAINT [Subscription_pkey];
ALTER TABLE [dbo].[Subscription] ALTER COLUMN [cycleId] INT NOT NULL;
ALTER TABLE [dbo].[Subscription] DROP COLUMN [id];
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT Subscription_pkey PRIMARY KEY CLUSTERED ([cycleId],[userId]);

-- AddForeignKey
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_cycleId_fkey] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
