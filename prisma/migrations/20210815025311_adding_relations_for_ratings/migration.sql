-- CreateTable
CREATE TABLE [dbo].[RatingOnWork] (
    [userId] INT NOT NULL,
    [workId] INT NOT NULL,
    [qty] INT NOT NULL CONSTRAINT [DF__RatingOnWork__qty] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__RatingOnWork__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__RatingOnWork__userId_workId] PRIMARY KEY ([userId],[workId])
);

-- CreateTable
CREATE TABLE [dbo].[RatingOnCycle] (
    [userId] INT NOT NULL,
    [cycleId] INT NOT NULL,
    [qty] INT NOT NULL CONSTRAINT [DF__RatingOnCycle__qty] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__RatingOnCycle__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__RatingOnCycle__userId_cycleId] PRIMARY KEY ([userId],[cycleId])
);

-- CreateTable
CREATE TABLE [dbo].[RatingOnPost] (
    [userId] INT NOT NULL,
    [postId] INT NOT NULL,
    [qty] INT NOT NULL CONSTRAINT [DF__RatingOnPost__qty] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF__RatingOnPost__created_at] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [PK__RatingOnPost__userId_postId] PRIMARY KEY ([userId],[postId])
);

-- AddForeignKey
ALTER TABLE [dbo].[RatingOnWork] ADD CONSTRAINT [FK__RatingOnWork__userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RatingOnWork] ADD CONSTRAINT [FK__RatingOnWork__workId] FOREIGN KEY ([workId]) REFERENCES [dbo].[works]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RatingOnCycle] ADD CONSTRAINT [FK__RatingOnCycle__userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RatingOnCycle] ADD CONSTRAINT [FK__RatingOnCycle__cycleId] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RatingOnPost] ADD CONSTRAINT [FK__RatingOnPost__userId] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RatingOnPost] ADD CONSTRAINT [FK__RatingOnPost__postId] FOREIGN KEY ([postId]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
