/*
  Warnings:

  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE [dbo].[_UserFollows] DROP CONSTRAINT [FK___UserFollows__A];

-- DropForeignKey
ALTER TABLE [dbo].[_UserFollows] DROP CONSTRAINT [FK___UserFollows__B];

-- DropTable
DROP TABLE [dbo].[_UserFollows];

-- CreateTable
CREATE TABLE [dbo].[__UserFollows] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [__UserFollows_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [__UserFollows_B_index] ON [dbo].[__UserFollows]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[__UserFollows] ADD CONSTRAINT [FK____UserFollows__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[__UserFollows] ADD CONSTRAINT [FK____UserFollows__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
