/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Subscription] DROP CONSTRAINT [Subscription_pkey];
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT Subscription_pkey PRIMARY KEY CLUSTERED ([cycleId],[userId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
