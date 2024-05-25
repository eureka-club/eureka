/*
  Warnings:

  - You are about to alter the column `to` on the `ComentCreatedDaily` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(4000)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ComentCreatedDaily] ALTER COLUMN [to] VARCHAR(4000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
