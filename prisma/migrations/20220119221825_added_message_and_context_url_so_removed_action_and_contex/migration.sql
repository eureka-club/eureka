/*
  Warnings:

  - You are about to drop the column `action` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `context` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `contextURL` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Notification] DROP COLUMN [action],
[context];
ALTER TABLE [dbo].[Notification] ADD [contextURL] NVARCHAR(1000) NOT NULL,
[message] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
