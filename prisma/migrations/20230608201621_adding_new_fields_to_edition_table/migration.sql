/*
  Warnings:

  - You are about to drop the column `publicationDate` on the `Edition` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Edition` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Edition] DROP COLUMN [publicationDate];
ALTER TABLE [dbo].[Edition] ADD [countryOfOrigin] NVARCHAR(1000),
[created_at] DATETIME2 NOT NULL CONSTRAINT [Edition_created_at_df] DEFAULT CURRENT_TIMESTAMP,
[length] NVARCHAR(1000),
[publication_year] DATETIME2,
[updated_at] DATETIME2 NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[_EditionToLocalImage] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_EditionToLocalImage_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_EditionToLocalImage_B_index] ON [dbo].[_EditionToLocalImage]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_EditionToLocalImage] ADD CONSTRAINT [_EditionToLocalImage_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Edition]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_EditionToLocalImage] ADD CONSTRAINT [_EditionToLocalImage_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
