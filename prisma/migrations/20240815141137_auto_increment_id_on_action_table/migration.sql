BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Action'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Action] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT,
    [cycleId] INT,
    [type] INT NOT NULL,
    [userId] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Action_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Action_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Action] ON;
IF EXISTS(SELECT * FROM [dbo].[Action])
    EXEC('INSERT INTO [dbo].[_prisma_new_Action] ([created_at],[cycleId],[id],[postId],[type],[userId]) SELECT [created_at],[cycleId],[id],[postId],[type],[userId] FROM [dbo].[Action] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Action] OFF;
DROP TABLE [dbo].[Action];
EXEC SP_RENAME N'dbo._prisma_new_Action', N'Action';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
