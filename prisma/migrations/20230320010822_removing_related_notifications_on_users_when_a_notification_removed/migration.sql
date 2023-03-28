BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[NotificationsOnUsers] DROP CONSTRAINT [NotificationsOnUsers_notificationId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[NotificationsOnUsers] ADD CONSTRAINT [NotificationsOnUsers_notificationId_fkey] FOREIGN KEY ([notificationId]) REFERENCES [dbo].[Notification]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
