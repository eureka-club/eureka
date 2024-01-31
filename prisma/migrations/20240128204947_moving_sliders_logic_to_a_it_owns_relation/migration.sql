/*
  Warnings:

  - You are about to drop the column `SlideImage1` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideImage2` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideImage3` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideText1` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideText2` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideText3` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideTitle1` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideTitle2` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `SlideTitle3` on the `backOfficeSettings` table. All the data in the column will be lost.
  - You are about to drop the `_BackOfficeSettingsToLocalImage` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsToLocalImage] DROP CONSTRAINT [FK___BackOfficeSettingsToLocalImage__A];

-- DropForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsToLocalImage] DROP CONSTRAINT [FK___BackOfficeSettingsToLocalImage__B];

-- AlterTable
ALTER TABLE [dbo].[backOfficeSettings] DROP COLUMN [SlideImage1],
[SlideImage2],
[SlideImage3],
[SlideText1],
[SlideText2],
[SlideText3],
[SlideTitle1],
[SlideTitle2],
[SlideTitle3];

-- DropTable
DROP TABLE [dbo].[_BackOfficeSettingsToLocalImage];

-- AddForeignKey
ALTER TABLE [dbo].[backOfficeSettingsSliders] ADD CONSTRAINT [backOfficeSettingsSliders_backOfficeSettingId_fkey] FOREIGN KEY ([backOfficeSettingId]) REFERENCES [dbo].[backOfficeSettings]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
