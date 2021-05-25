/*
  Warnings:

  - You are about to alter the column `content_text` on the `cycles` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `NVarChar(1000)`.
  - You are about to alter the column `content_text` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `NVarChar(1000)`.
  - You are about to alter the column `content_text` on the `works` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `NVarChar(1000)`.
  - Added the required column `tags` to the `works` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE [dbo].[cycles] ALTER COLUMN [content_text] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[posts] ALTER COLUMN [content_text] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[works] ALTER COLUMN [content_text] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[works] ADD [tags] NVARCHAR(1000) NOT NULL;
