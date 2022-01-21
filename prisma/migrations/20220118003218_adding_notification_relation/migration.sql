BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Notification] (
    [id] INT NOT NULL IDENTITY(1,1),
    [action] NVARCHAR(1000) NOT NULL,
    [context] NVARCHAR(1000) NOT NULL,
    [fromUserId] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Notification_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Notification_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Notification_fromUserId_key] UNIQUE ([fromUserId])
);

-- CreateTable
CREATE TABLE [dbo].[NotificationsOnUsers] (
    [userId] INT NOT NULL,
    [notificationId] INT NOT NULL,
    [viewed] BIT NOT NULL CONSTRAINT [NotificationsOnUsers_viewed_df] DEFAULT 0,
    CONSTRAINT [NotificationsOnUsers_pkey] PRIMARY KEY ([userId],[notificationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Notification] ADD CONSTRAINT [Notification_fromUserId_fkey] FOREIGN KEY ([fromUserId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NotificationsOnUsers] ADD CONSTRAINT [NotificationsOnUsers_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[NotificationsOnUsers] ADD CONSTRAINT [NotificationsOnUsers_notificationId_fkey] FOREIGN KEY ([notificationId]) REFERENCES [dbo].[Notification]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
