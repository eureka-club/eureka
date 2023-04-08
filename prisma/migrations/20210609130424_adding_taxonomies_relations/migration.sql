-- CreateTable
CREATE TABLE [dbo].[taxonomies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [creator_id] INT,
    [label] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [content_text] VARCHAR(4000) NOT NULL,
    [weight] INT CONSTRAINT [DF__taxonomies__weight] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__taxonomies__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__taxonomies__id] PRIMARY KEY ([id]),
    CONSTRAINT [taxonomies_code_unique] UNIQUE ([code])
);

-- CreateTable
CREATE TABLE [dbo].[terms] (
    [id] INT NOT NULL IDENTITY(1,1),
    [taxonomy_id] INT NOT NULL,
    [parent_id] INT,
    [creator_id] INT,
    [label] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [content_text] VARCHAR(4000) NOT NULL,
    [weight] INT CONSTRAINT [DF__terms__weight] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__terms__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__terms__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_TaxonomyTermWork] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_TaxonomyTermWork_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_TaxonomyTermCycle] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_TaxonomyTermCycle_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_TaxonomyTermPost] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_TaxonomyTermPost_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [code_index] ON [dbo].[taxonomies]([code]);

-- CreateIndex
CREATE INDEX [code_index] ON [dbo].[terms]([code]);

-- CreateIndex
CREATE INDEX [_TaxonomyTermWork_B_index] ON [dbo].[_TaxonomyTermWork]([B]);

-- CreateIndex
CREATE INDEX [_TaxonomyTermCycle_B_index] ON [dbo].[_TaxonomyTermCycle]([B]);

-- CreateIndex
CREATE INDEX [_TaxonomyTermPost_B_index] ON [dbo].[_TaxonomyTermPost]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[taxonomies] ADD CONSTRAINT [FK__taxonomies__creator_id] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [FK__terms__taxonomy_id] FOREIGN KEY ([taxonomy_id]) REFERENCES [dbo].[taxonomies]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [FK__terms__parent_id] FOREIGN KEY ([parent_id]) REFERENCES [dbo].[terms]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [FK__terms__creator_id] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermWork] ADD CONSTRAINT [FK___TaxonomyTermWork__A] FOREIGN KEY ([A]) REFERENCES [dbo].[terms]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermWork] ADD CONSTRAINT [FK___TaxonomyTermWork__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermCycle] ADD CONSTRAINT [FK___TaxonomyTermCycle__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermCycle] ADD CONSTRAINT [FK___TaxonomyTermCycle__B] FOREIGN KEY ([B]) REFERENCES [dbo].[terms]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermPost] ADD CONSTRAINT [FK___TaxonomyTermPost__A] FOREIGN KEY ([A]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermPost] ADD CONSTRAINT [FK___TaxonomyTermPost__B] FOREIGN KEY ([B]) REFERENCES [dbo].[terms]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
