BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[PostReaction] (
    [userId] INT NOT NULL,
    [postId] INT NOT NULL,
    [emoji] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [PostReaction_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PostReaction_pkey] PRIMARY KEY CLUSTERED ([userId],[postId])
);

-- AddForeignKey
ALTER TABLE [dbo].[PostReaction] ADD CONSTRAINT [PostReaction_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PostReaction] ADD CONSTRAINT [PostReaction_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[posts]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
