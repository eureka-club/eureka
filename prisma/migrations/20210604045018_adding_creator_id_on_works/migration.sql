-- AlterTable
ALTER TABLE [dbo].[works] ADD [creator_id] INT NOT NULL CONSTRAINT [DF__works__creator_id] DEFAULT 1;

-- CreateIndex
CREATE INDEX [works_creator_id_index] ON [dbo].[works]([creator_id]);
