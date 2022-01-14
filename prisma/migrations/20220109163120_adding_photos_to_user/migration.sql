BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[comments] DROP CONSTRAINT [comments_status_df];
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_status_df] DEFAULT 0 FOR [status];

-- CreateTable
CREATE TABLE [dbo].[_LocalImageToUser] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_LocalImageToUser_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [_LocalImageToUser_B_index] ON [dbo].[_LocalImageToUser]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToUser] ADD CONSTRAINT [FK___LocalImageToUser__A] FOREIGN KEY ([A]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToUser] ADD CONSTRAINT [FK___LocalImageToUser__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
