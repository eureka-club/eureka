BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserCustomData] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [identifier] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [UserCustomData_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [UserCustomData_identifier_key] UNIQUE ([identifier])
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
