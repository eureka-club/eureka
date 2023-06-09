BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Edition] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [publicationDate] DATETIME2 NOT NULL,
    [language] NVARCHAR(1000) NOT NULL,
    [contentText] NVARCHAR(1000),
    [workId] INT NOT NULL,
    CONSTRAINT [Edition_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Edition_language_idx] ON [dbo].[Edition]([language]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Edition_workId_idx] ON [dbo].[Edition]([workId]);

-- AddForeignKey
ALTER TABLE [dbo].[Edition] ADD CONSTRAINT [Edition_workId_fkey] FOREIGN KEY ([workId]) REFERENCES [dbo].[works]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
