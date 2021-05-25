/*
  Warnings:

  - You are about to alter the column `content_text` on the `cycles` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `VarChar(4000)`.
  - You are about to alter the column `content_text` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `VarChar(4000)`.
  - You are about to alter the column `content_text` on the `works` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `VarChar(4000)`.

*/
-- AlterTable
ALTER TABLE [dbo].[cycles] ALTER COLUMN [content_text] VARCHAR(4000) NULL;

-- AlterTable
ALTER TABLE [dbo].[posts] ALTER COLUMN [content_text] VARCHAR(4000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[works] ALTER COLUMN [content_text] VARCHAR(4000) NULL;
ALTER TABLE [dbo].[works] ADD [tags] NVARCHAR(1000);
