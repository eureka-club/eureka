BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[backOfficeSettingsSliders] (
    [id] INT NOT NULL CONSTRAINT [backOfficeSettingsSliders_id_df] DEFAULT 1,
    [title] VARCHAR(200),
    [text] VARCHAR(200),
    [language] NVARCHAR(1000) NOT NULL CONSTRAINT [backOfficeSettingsSliders_language_df] DEFAULT 'pt',
    [publishedFrom] DATETIME2 NOT NULL CONSTRAINT [backOfficeSettingsSliders_publishedFrom_df] DEFAULT CURRENT_TIMESTAMP,
    [publishedTo] DATETIME2,
    [backOfficeSettingId] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [backOfficeSettingsSliders_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [backOfficeSettingsSliders_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [backOfficeSettingsSliders_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_BackOfficeSettingsSlidersToLocalImage] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_BackOfficeSettingsSlidersToLocalImage_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_BackOfficeSettingsSlidersToLocalImage_B_index] ON [dbo].[_BackOfficeSettingsSlidersToLocalImage]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[backOfficeSettingsSliders] ADD CONSTRAINT [backOfficeSettingsSliders_backOfficeSettingId_fkey] FOREIGN KEY ([backOfficeSettingId]) REFERENCES [dbo].[backOfficeSettings]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsSlidersToLocalImage] ADD CONSTRAINT [_BackOfficeSettingsSlidersToLocalImage_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[backOfficeSettingsSliders]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsSlidersToLocalImage] ADD CONSTRAINT [_BackOfficeSettingsSlidersToLocalImage_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[local_images]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
