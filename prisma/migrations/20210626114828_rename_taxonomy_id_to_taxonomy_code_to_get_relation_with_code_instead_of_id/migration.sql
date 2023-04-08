/*
  Warnings:

  - You are about to drop the column `taxonomy_id` on the `terms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE [dbo].[terms] DROP CONSTRAINT [FK__terms__taxonomy_id];

-- AlterTable
ALTER TABLE [dbo].[terms] DROP COLUMN [taxonomy_id];
ALTER TABLE [dbo].[terms] ADD [taxonomy_code] NVARCHAR(1000) NOT NULL CONSTRAINT [DF__terms__taxonomy_code] DEFAULT 'region';

-- AddForeignKey
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [FK__terms__taxonomy_code] FOREIGN KEY ([taxonomy_code]) REFERENCES [dbo].[taxonomies]([code]) ON DELETE CASCADE ON UPDATE CASCADE;
