-- CreateTable
CREATE TABLE [dbo].[_UserFollows] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_UserFollows_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [_UserFollows_B_index] ON [dbo].[_UserFollows]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_UserFollows] ADD CONSTRAINT [FK___UserFollows__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_UserFollows] ADD CONSTRAINT [FK___UserFollows__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
