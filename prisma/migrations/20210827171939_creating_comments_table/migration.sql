-- CreateTable
CREATE TABLE [dbo].[comments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [creator_id] INT NOT NULL,
    [content_text] VARCHAR(4000) NOT NULL,
    [cycle_id] INT,
    [work_id] INT,
    [commentId] INT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__comments__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__comments__id] PRIMARY KEY ([id])
);

-- CreateIndex
CREATE INDEX [posts_creator_id_index] ON [dbo].[comments]([creator_id]);

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__creator_id] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__cycle_id] FOREIGN KEY ([cycle_id]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__work_id] FOREIGN KEY ([work_id]) REFERENCES [dbo].[works]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__commentId] FOREIGN KEY ([commentId]) REFERENCES [dbo].[comments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
