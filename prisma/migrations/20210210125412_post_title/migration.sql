/*
  Warnings:

  - Added the required column `title` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE [dbo].[posts] ADD [title] NVARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE INDEX [works_author_index] ON [dbo].[works]([author]);
