/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `customerId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cycles] ADD [priceInPlots] NVARCHAR(1000) NOT NULL CONSTRAINT [cycles_priceInPlots_df] DEFAULT '';

-- AlterTable
ALTER TABLE [dbo].[Subscription] DROP CONSTRAINT [Subscription_pkey];
ALTER TABLE [dbo].[Subscription] ALTER COLUMN [customerId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT Subscription_pkey PRIMARY KEY CLUSTERED ([cycleId],[userId],[customerId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
