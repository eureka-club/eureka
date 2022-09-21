BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cycles] ADD [disabled] BIT CONSTRAINT [cycles_disabled_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[works] ADD [disabled] BIT CONSTRAINT [works_disabled_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
