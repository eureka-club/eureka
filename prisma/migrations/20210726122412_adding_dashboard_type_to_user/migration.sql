-- AlterTable
ALTER TABLE [dbo].[users] ADD [dashboard_type] INT CONSTRAINT [DF__users__dashboard_type] DEFAULT 3;
