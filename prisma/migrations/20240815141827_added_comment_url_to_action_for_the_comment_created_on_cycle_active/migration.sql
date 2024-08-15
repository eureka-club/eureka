BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Action] ADD [commentURL] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Action] ADD CONSTRAINT [Action_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[posts]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Action] ADD CONSTRAINT [Action_cycleId_fkey] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Action] ADD CONSTRAINT [Action_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
