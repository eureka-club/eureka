BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Action] (
    [id] INT NOT NULL,
    [postId] INT,
    [type] INT NOT NULL,
    [userId] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Action_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Action_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Action] ADD CONSTRAINT [Action_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[posts]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

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
