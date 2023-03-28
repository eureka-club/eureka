/*
  Warnings:

  - You are about to drop the column `access_token_expires` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `compound_id` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_id,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[accounts] DROP CONSTRAINT [accounts_compound_id_key];

-- AlterTable
ALTER TABLE [dbo].[accounts] DROP COLUMN [access_token_expires],
[compound_id];
ALTER TABLE [dbo].[accounts] ADD [expires_at] INT,
[id_token] TEXT,
[scope] NVARCHAR(1000),
[session_state] NVARCHAR(1000),
[token_type] NVARCHAR(1000);

-- CreateIndex
CREATE UNIQUE INDEX [accounts_provider_id_provider_account_id_key] ON [dbo].[accounts]([provider_id], [provider_account_id]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
