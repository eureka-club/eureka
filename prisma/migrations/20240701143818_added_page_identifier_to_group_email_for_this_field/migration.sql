BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ComentCreatedDaily] ADD [pageIdentifier] NVARCHAR(1000) NOT NULL CONSTRAINT [ComentCreatedDaily_pageIdentifier_df] DEFAULT '';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
