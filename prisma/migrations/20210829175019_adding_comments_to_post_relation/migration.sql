-- AlterTable
ALTER TABLE [dbo].[comments] ADD [post_id] INT;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__post_id] FOREIGN KEY ([post_id]) REFERENCES [dbo].[posts]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
