/*
  Warnings:

  - You are about to drop the column `SlideImage1` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideImage2` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideImage3` on the `backOfficeSettings` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[backOfficeSettings] DROP COLUMN [SlideImage1],
[SlideImage2],
[SlideImage3];

-- CreateTable
CREATE TABLE [dbo].[_BackOfficeSettingsToLocalImage] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_BackOfficeSettingsToLocalImage_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [_BackOfficeSettingsToLocalImage_B_index] ON [dbo].[_BackOfficeSettingsToLocalImage]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsToLocalImage] ADD CONSTRAINT [FK___BackOfficeSettingsToLocalImage__A] FOREIGN KEY ([A]) REFERENCES [dbo].[backOfficeSettings]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsToLocalImage] ADD CONSTRAINT [FK___BackOfficeSettingsToLocalImage__B] FOREIGN KEY ([B]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
