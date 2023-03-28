-- AlterTable
ALTER TABLE [dbo].[users] DROP CONSTRAINT [DF__users__dashboard_type];
ALTER TABLE [dbo].[users] ADD CONSTRAINT [DF__users__dashboard_type] DEFAULT 1 FOR [dashboard_type];
