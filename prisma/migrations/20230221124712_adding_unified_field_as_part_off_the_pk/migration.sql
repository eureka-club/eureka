/*
  Warnings:

  - The primary key for the `PostReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[PostReaction] DROP CONSTRAINT [PostReaction_pkey];
ALTER TABLE [dbo].[PostReaction] ADD CONSTRAINT PostReaction_pkey PRIMARY KEY CLUSTERED ([userId],[postId],[unified]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
