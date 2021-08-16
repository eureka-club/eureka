/*
  Warnings:

  - You are about to drop the `RatingOnCycle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE [dbo].[RatingOnCycle] DROP CONSTRAINT [FK__RatingOnCycle__cycleId];

-- DropForeignKey
ALTER TABLE [dbo].[RatingOnCycle] DROP CONSTRAINT [FK__RatingOnCycle__userId];

-- DropTable
DROP TABLE [dbo].[RatingOnCycle];

-- CreateTable
CREATE TABLE [dbo].[ratingOnCycleId] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [cycleId] INT,
    [qty] INT NOT NULL CONSTRAINT [DF__ratingOnCycleId__qty] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__ratingOnCycleId__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__ratingOnCycleId__id] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] ADD CONSTRAINT [FK__ratingOnCycleId__userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] ADD CONSTRAINT [FK__ratingOnCycleId__cycleId] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
