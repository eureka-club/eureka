/*
  Warnings:

  - You are about to drop the column `contentText` on the `Edition` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Edition] DROP COLUMN [contentText];
ALTER TABLE [dbo].[Edition] ADD [content_text] VARCHAR(4000),
[isbn] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
