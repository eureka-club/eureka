BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsSlidersToLocalImage] DROP CONSTRAINT [_BackOfficeSettingsSlidersToLocalImage_A_fkey];

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[backOfficeSettingsSliders] DROP CONSTRAINT [backOfficeSettingsSliders_id_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'backOfficeSettingsSliders'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_backOfficeSettingsSliders] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] VARCHAR(200),
    [text] VARCHAR(4000),
    [language] NVARCHAR(1000) NOT NULL CONSTRAINT [backOfficeSettingsSliders_language_df] DEFAULT 'pt',
    [publishedFrom] DATETIME2 NOT NULL CONSTRAINT [backOfficeSettingsSliders_publishedFrom_df] DEFAULT CURRENT_TIMESTAMP,
    [publishedTo] DATETIME2,
    [backOfficeSettingId] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [backOfficeSettingsSliders_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [backOfficeSettingsSliders_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_backOfficeSettingsSliders] ON;
IF EXISTS(SELECT * FROM [dbo].[backOfficeSettingsSliders])
    EXEC('INSERT INTO [dbo].[_prisma_new_backOfficeSettingsSliders] ([backOfficeSettingId],[created_at],[id],[language],[publishedFrom],[publishedTo],[text],[title],[updated_at]) SELECT [backOfficeSettingId],[created_at],[id],[language],[publishedFrom],[publishedTo],[text],[title],[updated_at] FROM [dbo].[backOfficeSettingsSliders] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_backOfficeSettingsSliders] OFF;
DROP TABLE [dbo].[backOfficeSettingsSliders];
EXEC SP_RENAME N'dbo._prisma_new_backOfficeSettingsSliders', N'backOfficeSettingsSliders';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[_BackOfficeSettingsSlidersToLocalImage] ADD CONSTRAINT [_BackOfficeSettingsSlidersToLocalImage_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[backOfficeSettingsSliders]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
