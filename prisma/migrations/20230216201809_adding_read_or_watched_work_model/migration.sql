BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[readOrWatchedWorkId] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [workId] INT,
    [year] INT NOT NULL CONSTRAINT [readOrWatchedWorkId_year_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [readOrWatchedWorkId_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [readOrWatchedWorkId_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[readOrWatchedWorkId] ADD CONSTRAINT [readOrWatchedWorkId_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[readOrWatchedWorkId] ADD CONSTRAINT [readOrWatchedWorkId_workId_fkey] FOREIGN KEY ([workId]) REFERENCES [dbo].[works]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
