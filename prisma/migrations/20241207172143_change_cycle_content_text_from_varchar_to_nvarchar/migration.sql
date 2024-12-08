/*
  Warnings:

  - You are about to alter the column `content_text` on the `cycles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(Max)` to `NVarChar(Max)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cycles] ALTER COLUMN [content_text] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
