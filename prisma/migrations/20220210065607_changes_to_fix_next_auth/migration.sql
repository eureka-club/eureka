/*
  Warnings:

  - The primary key for the `NotificationsOnUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `__UserFollows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[__UserFollows] DROP CONSTRAINT [FK____UserFollows__A];

-- DropForeignKey
ALTER TABLE [dbo].[__UserFollows] DROP CONSTRAINT [FK____UserFollows__B];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToFavs] DROP CONSTRAINT [FK___CycleToFavs__B];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToLikes] DROP CONSTRAINT [FK___CycleToLikes__B];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToParticipant] DROP CONSTRAINT [FK___CycleToParticipant__B];

-- DropForeignKey
ALTER TABLE [dbo].[_LocalImageToUser] DROP CONSTRAINT [FK___LocalImageToUser__B];

-- DropForeignKey
ALTER TABLE [dbo].[_PostToFavs] DROP CONSTRAINT [FK___PostToFavs__B];

-- DropForeignKey
ALTER TABLE [dbo].[_PostToLikes] DROP CONSTRAINT [FK___PostToLikes__B];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkReadOrWatched] DROP CONSTRAINT [FK___WorkReadOrWatched__A];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkToFavs] DROP CONSTRAINT [FK___WorkToFavs__A];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkToLikes] DROP CONSTRAINT [FK___WorkToLikes__A];

-- DropForeignKey
ALTER TABLE [dbo].[accounts] DROP CONSTRAINT [accounts_user_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[comments] DROP CONSTRAINT [comments_creator_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[cycles] DROP CONSTRAINT [cycles_creator_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Notification] DROP CONSTRAINT [Notification_fromUserId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[NotificationsOnUsers] DROP CONSTRAINT [NotificationsOnUsers_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[posts] DROP CONSTRAINT [posts_creator_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] DROP CONSTRAINT [ratingOnCycleId_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ratingOnWorkId] DROP CONSTRAINT [ratingOnWorkId_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[sessions] DROP CONSTRAINT [sessions_user_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[taxonomies] DROP CONSTRAINT [taxonomies_creator_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[terms] DROP CONSTRAINT [terms_creator_id_fkey];

-- DropIndex
ALTER TABLE [dbo].[_CycleToFavs] DROP CONSTRAINT [_CycleToFavs_AB_unique];

-- DropIndex
DROP INDEX [_CycleToFavs_B_index] ON [dbo].[_CycleToFavs];

-- DropIndex
ALTER TABLE [dbo].[_CycleToLikes] DROP CONSTRAINT [_CycleToLikes_AB_unique];

-- DropIndex
DROP INDEX [_CycleToLikes_B_index] ON [dbo].[_CycleToLikes];

-- DropIndex
ALTER TABLE [dbo].[_CycleToParticipant] DROP CONSTRAINT [_CycleToParticipant_AB_unique];

-- DropIndex
DROP INDEX [_CycleToParticipant_B_index] ON [dbo].[_CycleToParticipant];

-- DropIndex
ALTER TABLE [dbo].[_LocalImageToUser] DROP CONSTRAINT [_LocalImageToUser_AB_unique];

-- DropIndex
DROP INDEX [_LocalImageToUser_B_index] ON [dbo].[_LocalImageToUser];

-- DropIndex
ALTER TABLE [dbo].[_PostToFavs] DROP CONSTRAINT [_PostToFavs_AB_unique];

-- DropIndex
DROP INDEX [_PostToFavs_B_index] ON [dbo].[_PostToFavs];

-- DropIndex
ALTER TABLE [dbo].[_PostToLikes] DROP CONSTRAINT [_PostToLikes_AB_unique];

-- DropIndex
DROP INDEX [_PostToLikes_B_index] ON [dbo].[_PostToLikes];

-- DropIndex
ALTER TABLE [dbo].[_WorkReadOrWatched] DROP CONSTRAINT [_WorkReadOrWatched_AB_unique];

-- DropIndex
ALTER TABLE [dbo].[_WorkToFavs] DROP CONSTRAINT [_WorkToFavs_AB_unique];

-- DropIndex
ALTER TABLE [dbo].[_WorkToLikes] DROP CONSTRAINT [_WorkToLikes_AB_unique];

-- DropIndex
DROP INDEX [comment_creator_id_index] ON [dbo].[comments];

-- DropIndex
DROP INDEX [cycles_creator_id_index] ON [dbo].[cycles];

-- DropIndex
DROP INDEX [posts_creator_id_index] ON [dbo].[posts];

-- DropIndex
DROP INDEX [works_creator_id_index] ON [dbo].[works];

-- AlterTable
ALTER TABLE [dbo].[_CycleToFavs] ALTER COLUMN [B] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_CycleToLikes] ALTER COLUMN [B] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_CycleToParticipant] ALTER COLUMN [B] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_LocalImageToUser] ALTER COLUMN [B] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_PostToFavs] ALTER COLUMN [B] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_PostToLikes] ALTER COLUMN [B] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_WorkReadOrWatched] ALTER COLUMN [A] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_WorkToFavs] ALTER COLUMN [A] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[_WorkToLikes] ALTER COLUMN [A] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[comments] ALTER COLUMN [creator_id] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[cycles] ALTER COLUMN [creator_id] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Notification] ALTER COLUMN [fromUserId] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[NotificationsOnUsers] DROP CONSTRAINT [NotificationsOnUsers_pkey];
ALTER TABLE [dbo].[NotificationsOnUsers] ALTER COLUMN [userId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[NotificationsOnUsers] ADD CONSTRAINT NotificationsOnUsers_pkey PRIMARY KEY ([userId],[notificationId]);

-- AlterTable
ALTER TABLE [dbo].[posts] ALTER COLUMN [creator_id] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[ratingOnCycleId] ALTER COLUMN [userId] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[ratingOnWorkId] ALTER COLUMN [userId] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[taxonomies] ALTER COLUMN [creator_id] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[terms] ALTER COLUMN [creator_id] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[works] DROP CONSTRAINT [works_creator_id_df];
ALTER TABLE [dbo].[works] ALTER COLUMN [creator_id] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[__UserFollows];

-- DropTable
DROP TABLE [dbo].[accounts];

-- DropTable
DROP TABLE [dbo].[sessions];

-- CreateTable
CREATE TABLE [dbo].[Follows] (
    [followerId] NVARCHAR(1000) NOT NULL,
    [followingId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Follows_pkey] PRIMARY KEY ([followerId],[followingId])
);

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [refresh_token] TEXT,
    [access_token] TEXT,
    [expires_at] INT,
    [token_type] NVARCHAR(1000),
    [scope] NVARCHAR(1000),
    [id_token] TEXT,
    [session_state] NVARCHAR(1000),
    [oauth_token_secret] NVARCHAR(1000),
    [oauth_token] NVARCHAR(1000),
    CONSTRAINT [Account_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE ([provider],[providerAccountId])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sessionToken] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Session_sessionToken_key] UNIQUE ([sessionToken])
);

-- CreateTable
CREATE TABLE [dbo].[VerificationToken] (
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [VerificationToken_token_key] UNIQUE ([token]),
    CONSTRAINT [VerificationToken_identifier_token_key] UNIQUE ([identifier],[token])
);

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[users] DROP CONSTRAINT [users_email_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'users'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_users] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [email_verified] DATETIME2,
    [image] NVARCHAR(1000),
    [roles] NVARCHAR(1000) NOT NULL CONSTRAINT [users_roles_df] DEFAULT 'member',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [country_of_origin] NVARCHAR(1000),
    [about_me] NVARCHAR(1000),
    [dashboard_type] INT CONSTRAINT [users_dashboard_type_df] DEFAULT 1,
    [tags] NVARCHAR(1000),
    CONSTRAINT [users_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [users_email_key] UNIQUE ([email])
);
IF EXISTS(SELECT * FROM [dbo].[users])
    EXEC('INSERT INTO [dbo].[_prisma_new_users] ([about_me],[country_of_origin],[created_at],[dashboard_type],[email],[email_verified],[id],[image],[name],[roles],[tags],[updated_at]) SELECT [about_me],[country_of_origin],[created_at],[dashboard_type],[email],[email_verified],[id],[image],[name],[roles],[tags],[updated_at] FROM [dbo].[users] WITH (holdlock tablockx)');
DROP TABLE [dbo].[users];
EXEC SP_RENAME N'dbo._prisma_new_users', N'users';
COMMIT;

-- CreateIndex
CREATE INDEX [cycles_creator_id_index] ON [dbo].[cycles]([creator_id]);

-- CreateIndex
CREATE INDEX [works_creator_id_index] ON [dbo].[works]([creator_id]);

-- CreateIndex
CREATE INDEX [posts_creator_id_index] ON [dbo].[posts]([creator_id]);

-- CreateIndex
CREATE INDEX [comment_creator_id_index] ON [dbo].[comments]([creator_id]);

-- CreateIndex
CREATE UNIQUE INDEX [_LocalImageToUser_AB_unique] ON [dbo].[_LocalImageToUser]([A], [B]);

-- CreateIndex
CREATE INDEX [_LocalImageToUser_B_index] ON [dbo].[_LocalImageToUser]([B]);

-- CreateIndex
CREATE UNIQUE INDEX [_CycleToParticipant_AB_unique] ON [dbo].[_CycleToParticipant]([A], [B]);

-- CreateIndex
CREATE INDEX [_CycleToParticipant_B_index] ON [dbo].[_CycleToParticipant]([B]);

-- CreateIndex
CREATE UNIQUE INDEX [_CycleToLikes_AB_unique] ON [dbo].[_CycleToLikes]([A], [B]);

-- CreateIndex
CREATE INDEX [_CycleToLikes_B_index] ON [dbo].[_CycleToLikes]([B]);

-- CreateIndex
CREATE UNIQUE INDEX [_CycleToFavs_AB_unique] ON [dbo].[_CycleToFavs]([A], [B]);

-- CreateIndex
CREATE INDEX [_CycleToFavs_B_index] ON [dbo].[_CycleToFavs]([B]);

-- CreateIndex
CREATE UNIQUE INDEX [_PostToLikes_AB_unique] ON [dbo].[_PostToLikes]([A], [B]);

-- CreateIndex
CREATE INDEX [_PostToLikes_B_index] ON [dbo].[_PostToLikes]([B]);

-- CreateIndex
CREATE UNIQUE INDEX [_PostToFavs_AB_unique] ON [dbo].[_PostToFavs]([A], [B]);

-- CreateIndex
CREATE INDEX [_PostToFavs_B_index] ON [dbo].[_PostToFavs]([B]);

-- CreateIndex
CREATE UNIQUE INDEX [_WorkToLikes_AB_unique] ON [dbo].[_WorkToLikes]([A], [B]);

-- CreateIndex
CREATE UNIQUE INDEX [_WorkToFavs_AB_unique] ON [dbo].[_WorkToFavs]([A], [B]);

-- CreateIndex
CREATE UNIQUE INDEX [_WorkReadOrWatched_AB_unique] ON [dbo].[_WorkReadOrWatched]([A], [B]);

-- AddForeignKey
ALTER TABLE [dbo].[cycles] ADD CONSTRAINT [cycles_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [posts_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[taxonomies] ADD CONSTRAINT [taxonomies_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [terms_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnWorkId] ADD CONSTRAINT [ratingOnWorkId_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] ADD CONSTRAINT [ratingOnCycleId_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notification] ADD CONSTRAINT [Notification_fromUserId_fkey] FOREIGN KEY ([fromUserId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NotificationsOnUsers] ADD CONSTRAINT [NotificationsOnUsers_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Follows] ADD CONSTRAINT [Follows_followerId_fkey] FOREIGN KEY ([followerId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Follows] ADD CONSTRAINT [Follows_followingId_fkey] FOREIGN KEY ([followingId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LocalImageToUser] ADD CONSTRAINT [FK___LocalImageToUser__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToParticipant] ADD CONSTRAINT [FK___CycleToParticipant__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLikes] ADD CONSTRAINT [FK___CycleToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToFavs] ADD CONSTRAINT [FK___CycleToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToLikes] ADD CONSTRAINT [FK___PostToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToFavs] ADD CONSTRAINT [FK___PostToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToLikes] ADD CONSTRAINT [FK___WorkToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToFavs] ADD CONSTRAINT [FK___WorkToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkReadOrWatched] ADD CONSTRAINT [FK___WorkReadOrWatched__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
