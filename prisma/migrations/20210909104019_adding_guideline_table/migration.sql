-- CreateTable
CREATE TABLE [dbo].[guidelines] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cycle_id] INT NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content_text] VARCHAR(4000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__guidelines__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__guidelines__id] PRIMARY KEY ([id])
);

-- CreateIndex
CREATE INDEX [guideline_cycle_id_index] ON [dbo].[guidelines]([cycle_id]);

-- AddForeignKey
ALTER TABLE [dbo].[guidelines] ADD CONSTRAINT [FK__guidelines__cycle_id] FOREIGN KEY ([cycle_id]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
