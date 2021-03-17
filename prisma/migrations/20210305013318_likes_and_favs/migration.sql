-- CreateTable
CREATE TABLE [dbo].[_CycleToLikes] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CycleToLikes_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CycleToFavs] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CycleToFavs_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_WorkToLikes] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_WorkToLikes_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_WorkToFavs] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_WorkToFavs_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_PostToLikes] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_PostToLikes_AB_unique] UNIQUE ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_PostToFavs] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_PostToFavs_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [_CycleToLikes_B_index] ON [dbo].[_CycleToLikes]([B]);

-- CreateIndex
CREATE INDEX [_CycleToFavs_B_index] ON [dbo].[_CycleToFavs]([B]);

-- CreateIndex
CREATE INDEX [_WorkToLikes_B_index] ON [dbo].[_WorkToLikes]([B]);

-- CreateIndex
CREATE INDEX [_WorkToFavs_B_index] ON [dbo].[_WorkToFavs]([B]);

-- CreateIndex
CREATE INDEX [_PostToLikes_B_index] ON [dbo].[_PostToLikes]([B]);

-- CreateIndex
CREATE INDEX [_PostToFavs_B_index] ON [dbo].[_PostToFavs]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLikes] ADD CONSTRAINT [FK___CycleToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLikes] ADD CONSTRAINT [FK___CycleToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToFavs] ADD CONSTRAINT [FK___CycleToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToFavs] ADD CONSTRAINT [FK___CycleToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToLikes] ADD CONSTRAINT [FK___WorkToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToLikes] ADD CONSTRAINT [FK___WorkToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToFavs] ADD CONSTRAINT [FK___WorkToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToFavs] ADD CONSTRAINT [FK___WorkToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_PostToLikes] ADD CONSTRAINT [FK___PostToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[posts]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_PostToLikes] ADD CONSTRAINT [FK___PostToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_PostToFavs] ADD CONSTRAINT [FK___PostToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[posts]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_PostToFavs] ADD CONSTRAINT [FK___PostToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]);
