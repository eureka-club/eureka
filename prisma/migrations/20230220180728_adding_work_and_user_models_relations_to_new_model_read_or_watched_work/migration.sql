/*
  Warnings:

  - You are about to drop the `_WorkReadOrWatched` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_WorkReadOrWatched] DROP CONSTRAINT [FK___WorkReadOrWatched__A];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkReadOrWatched] DROP CONSTRAINT [FK___WorkReadOrWatched__B];

-- DropTable
DROP TABLE [dbo].[_WorkReadOrWatched];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
