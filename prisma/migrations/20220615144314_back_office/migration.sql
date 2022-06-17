BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[backOfficeSettings] (
    [id] INT NOT NULL CONSTRAINT [backOfficeSettings_id_df] DEFAULT 1,
    [SlideImage1] NVARCHAR(1000),
    [SlideTitle1] VARCHAR(200),
    [SlideText1] VARCHAR(200),
    [SlideImage2] NVARCHAR(1000),
    [SlideTitle2] VARCHAR(200),
    [SlideText2] VARCHAR(200),
    [SlideImage3] NVARCHAR(1000),
    [SlideTitle3] VARCHAR(200),
    [SlideText3] VARCHAR(200),
    [CyclesExplorePage] VARCHAR(60),
    [PostExplorePage] VARCHAR(60),
    CONSTRAINT [backOfficeSettings_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [backOfficeSettings_id_key] UNIQUE ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
