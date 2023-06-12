BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Edition] ADD [ToCheck] BIT CONSTRAINT [Edition_ToCheck_df] DEFAULT 0,
[creator_id] INT NOT NULL CONSTRAINT [Edition_creator_id_df] DEFAULT 1;

-- AddForeignKey
ALTER TABLE [dbo].[Edition] ADD CONSTRAINT [Edition_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
