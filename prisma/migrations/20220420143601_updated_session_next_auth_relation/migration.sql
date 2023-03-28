/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[sessions] DROP CONSTRAINT [sessions_user_id_fkey];

-- DropTable
DROP TABLE [dbo].[sessions];

-- DropTable
DROP TABLE [dbo].[VerificationToken];

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] NVARCHAR(1000) NOT NULL,
    [sessionToken] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    [expires] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Session_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Session_sessionToken_key] UNIQUE ([sessionToken])
);

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
