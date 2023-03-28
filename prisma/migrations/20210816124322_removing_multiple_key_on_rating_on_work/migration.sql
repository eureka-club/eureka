/*
  Warnings:

  - You are about to drop the `RatingOnPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RatingOnWork` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE [dbo].[RatingOnPost] DROP CONSTRAINT [FK__RatingOnPost__postId];

-- DropForeignKey
ALTER TABLE [dbo].[RatingOnPost] DROP CONSTRAINT [FK__RatingOnPost__userId];

-- DropForeignKey
ALTER TABLE [dbo].[RatingOnWork] DROP CONSTRAINT [FK__RatingOnWork__userId];

-- DropForeignKey
ALTER TABLE [dbo].[RatingOnWork] DROP CONSTRAINT [FK__RatingOnWork__workId];

-- DropTable
DROP TABLE [dbo].[RatingOnPost];

-- DropTable
DROP TABLE [dbo].[RatingOnWork];

-- CreateTable
CREATE TABLE [dbo].[ratingOnWorkId] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [workId] INT,
    [qty] INT NOT NULL CONSTRAINT [DF__ratingOnWorkId__qty] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__ratingOnWorkId__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__ratingOnWorkId__id] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnWorkId] ADD CONSTRAINT [FK__ratingOnWorkId__userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnWorkId] ADD CONSTRAINT [FK__ratingOnWorkId__workId] FOREIGN KEY ([workId]) REFERENCES [dbo].[works]([id]) ON DELETE SET NULL ON UPDATE CASCADE;
