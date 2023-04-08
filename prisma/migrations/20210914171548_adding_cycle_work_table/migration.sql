BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CycleWork] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cycleId] INT,
    [workId] INT,
    [start_date] DATETIME2,
    [end_date] DATETIME2,
    CONSTRAINT [PK__CycleWork__id] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CycleWork] ADD CONSTRAINT [FK__CycleWork__cycleId] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CycleWork] ADD CONSTRAINT [FK__CycleWork__workId] FOREIGN KEY ([workId]) REFERENCES [dbo].[works]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
EXEC SP_RENAME N'dbo.comments.posts_creator_id_index', N'comment_creator_id_index', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.taxonomies.code_index', N'taxonomy_code_index', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.terms.code_index', N'term_code_index', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN 
    ROLLBACK TRAN;
END;
THROW

END CATCH
