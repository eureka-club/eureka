-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [email_verified] DATETIME2,
    [image] NVARCHAR(1000),
    [roles] NVARCHAR(1000) NOT NULL CONSTRAINT [DF__users__roles] DEFAULT 'member',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__users__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__users__id] PRIMARY KEY ([id]),
    CONSTRAINT [users_email_unique] UNIQUE ([email])
);

-- CreateTable
CREATE TABLE [dbo].[accounts] (
    [id] INT IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [compound_id] NVARCHAR(1000) NOT NULL,
    [provider_type] NVARCHAR(1000) NOT NULL,
    [provider_id] NVARCHAR(1000) NOT NULL,
    [provider_account_id] NVARCHAR(1000) NOT NULL,
    [refresh_token] NVARCHAR(1000),
    [access_token] NVARCHAR(1000),
    [access_token_expires] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__accounts__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__accounts__id] PRIMARY KEY ([id]),
    CONSTRAINT [accounts_compound_id_unique] UNIQUE ([compound_id])
);

-- CreateTable
CREATE TABLE [dbo].[sessions] (
    [id] INT IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [expires] DATETIME2 NOT NULL,
    [session_token] NVARCHAR(1000) NOT NULL,
    [access_token] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__sessions__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__sessions__id] PRIMARY KEY ([id]),
    CONSTRAINT [sessions_session_token_unique] UNIQUE ([session_token]),
    CONSTRAINT [sessions_access_token_unique] UNIQUE ([access_token])
);

-- CreateTable
CREATE TABLE [dbo].[verification_requests] (
    [id] INT IDENTITY(1,1),
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__verification_requests__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__verification_requests__id] PRIMARY KEY ([id]),
    CONSTRAINT [verification_requests_token_unique] UNIQUE ([token])
);

-- CreateTable
CREATE TABLE [dbo].[local_images] (
    [id] INT IDENTITY(1,1),
    [original_filename] NVARCHAR(1000) NOT NULL,
    [stored_file] NVARCHAR(1000) NOT NULL,
    [mime_type] NVARCHAR(1000) NOT NULL,
    [content_hash] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__local_images__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__local_images__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[works] (
    [id] INT IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content_text] NVARCHAR(1000),
    [author] NVARCHAR(1000) NOT NULL,
    [author_gender] NVARCHAR(1000),
    [author_race] NVARCHAR(1000),
    [link] NVARCHAR(1000),
    [publication_year] DATETIME2,
    [country_of_origin] NVARCHAR(1000),
    [length] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__works__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__works__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[cycles] (
    [id] INT IDENTITY(1,1),
    [creator_id] INT NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [languages] NVARCHAR(1000) NOT NULL,
    [content_text] NVARCHAR(1000),
    [start_date] DATETIME2 NOT NULL,
    [end_date] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__cycles__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__cycles__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[posts] (
    [id] INT IDENTITY(1,1),
    [creator_id] INT NOT NULL,
    [language] NVARCHAR(1000) NOT NULL,
    [content_text] NVARCHAR(1000),
    [is_public] BIT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__posts__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__posts__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_CycleToLocalImage] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CycleToLocalImage_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_LocalImageToPost] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_LocalImageToPost_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_LocalImageToWork] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_LocalImageToWork_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CycleToWork] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CycleToWork_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_PostToWork] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_PostToWork_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CycleToPost] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CycleToPost_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [accounts_user_id_index] ON [dbo].[accounts]([user_id]);

-- CreateIndex
CREATE INDEX [accounts_provider_id_index] ON [dbo].[accounts]([provider_id]);

-- CreateIndex
CREATE INDEX [accounts_provider_account_id_index] ON [dbo].[accounts]([provider_account_id]);

-- CreateIndex
CREATE INDEX [sessions_user_id_index] ON [dbo].[sessions]([user_id]);

-- CreateIndex
CREATE INDEX [local_images_content_hash_index] ON [dbo].[local_images]([content_hash]);

-- CreateIndex
CREATE INDEX [works_title_index] ON [dbo].[works]([title]);

-- CreateIndex
CREATE INDEX [cycles_creator_id_index] ON [dbo].[cycles]([creator_id]);

-- CreateIndex
CREATE INDEX [cycles_title_index] ON [dbo].[cycles]([title]);

-- CreateIndex
CREATE INDEX [posts_creator_id_index] ON [dbo].[posts]([creator_id]);

-- CreateIndex
CREATE INDEX [_CycleToLocalImage_B_index] ON [dbo].[_CycleToLocalImage]([B]);

-- CreateIndex
CREATE INDEX [_LocalImageToPost_B_index] ON [dbo].[_LocalImageToPost]([B]);

-- CreateIndex
CREATE INDEX [_LocalImageToWork_B_index] ON [dbo].[_LocalImageToWork]([B]);

-- CreateIndex
CREATE INDEX [_CycleToWork_B_index] ON [dbo].[_CycleToWork]([B]);

-- CreateIndex
CREATE INDEX [_PostToWork_B_index] ON [dbo].[_PostToWork]([B]);

-- CreateIndex
CREATE INDEX [_CycleToPost_B_index] ON [dbo].[_CycleToPost]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[accounts] ADD CONSTRAINT [FK__accounts__user_id] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[sessions] ADD CONSTRAINT [FK__sessions__user_id] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cycles] ADD CONSTRAINT [FK__cycles__creator_id] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [FK__posts__creator_id] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLocalImage] ADD CONSTRAINT [FK___CycleToLocalImage__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLocalImage] ADD CONSTRAINT [FK___CycleToLocalImage__B] FOREIGN KEY ([B]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToPost] ADD CONSTRAINT [FK___LocalImageToPost__A] FOREIGN KEY ([A]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToPost] ADD CONSTRAINT [FK___LocalImageToPost__B] FOREIGN KEY ([B]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToWork] ADD CONSTRAINT [FK___LocalImageToWork__A] FOREIGN KEY ([A]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToWork] ADD CONSTRAINT [FK___LocalImageToWork__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToWork] ADD CONSTRAINT [FK___CycleToWork__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToWork] ADD CONSTRAINT [FK___CycleToWork__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToWork] ADD CONSTRAINT [FK___PostToWork__A] FOREIGN KEY ([A]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToWork] ADD CONSTRAINT [FK___PostToWork__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToPost] ADD CONSTRAINT [FK___CycleToPost__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToPost] ADD CONSTRAINT [FK___CycleToPost__B] FOREIGN KEY ([B]) REFERENCES [dbo].[posts]([id]);
