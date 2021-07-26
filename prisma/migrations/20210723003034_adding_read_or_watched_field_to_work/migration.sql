-- CreateTable
CREATE TABLE [dbo].[_WorkReadOrWatched] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_WorkReadOrWatched_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [_WorkReadOrWatched_B_index] ON [dbo].[_WorkReadOrWatched]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_WorkReadOrWatched] ADD CONSTRAINT [FK___WorkReadOrWatched__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkReadOrWatched] ADD CONSTRAINT [FK___WorkReadOrWatched__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
