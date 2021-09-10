-- AlterTable
ALTER TABLE [dbo].[cycles] ADD [access] INT NOT NULL CONSTRAINT [DF__cycles__access] DEFAULT 1;
