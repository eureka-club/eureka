-- CreateTable
CREATE TABLE [dbo].[cycle_complementary_materials] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cycle_id] INT NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [author] NVARCHAR(1000) NOT NULL,
    [publication_name] DATETIME2 NOT NULL,
    [link] NVARCHAR(1000),
    [original_filename] NVARCHAR(1000),
    [stored_file] NVARCHAR(1000),
    [mime_type] NVARCHAR(1000),
    [content_hash] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__cycle_complementary_materials__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__cycle_complementary_materials__id] PRIMARY KEY ([id])
);

-- CreateIndex
CREATE INDEX [cycle_complementary_materials_cycle_id_index] ON [dbo].[cycle_complementary_materials]([cycle_id]);

-- AddForeignKey
ALTER TABLE [dbo].[cycle_complementary_materials]
  ADD CONSTRAINT [FK__cycle_complementary_materials__cycle_id]
  FOREIGN KEY ([cycle_id]) REFERENCES [dbo].[cycles]([id])
  ON DELETE CASCADE
  ON UPDATE CASCADE;
