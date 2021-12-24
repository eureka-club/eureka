BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToFavs] DROP CONSTRAINT [FK___CycleToFavs__A];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToFavs] DROP CONSTRAINT [FK___CycleToFavs__B];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToLikes] DROP CONSTRAINT [FK___CycleToLikes__A];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToLikes] DROP CONSTRAINT [FK___CycleToLikes__B];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToParticipant] DROP CONSTRAINT [FK___CycleToParticipant__A];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToParticipant] DROP CONSTRAINT [FK___CycleToParticipant__B];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToPost] DROP CONSTRAINT [FK___CycleToPost__A];

-- DropForeignKey
ALTER TABLE [dbo].[_CycleToPost] DROP CONSTRAINT [FK___CycleToPost__B];

-- DropForeignKey
ALTER TABLE [dbo].[_PostToFavs] DROP CONSTRAINT [FK___PostToFavs__A];

-- DropForeignKey
ALTER TABLE [dbo].[_PostToFavs] DROP CONSTRAINT [FK___PostToFavs__B];

-- DropForeignKey
ALTER TABLE [dbo].[_PostToLikes] DROP CONSTRAINT [FK___PostToLikes__A];

-- DropForeignKey
ALTER TABLE [dbo].[_PostToLikes] DROP CONSTRAINT [FK___PostToLikes__B];

-- DropForeignKey
ALTER TABLE [dbo].[_TaxonomyTermCycle] DROP CONSTRAINT [FK___TaxonomyTermCycle__B];

-- DropForeignKey
ALTER TABLE [dbo].[_TaxonomyTermPost] DROP CONSTRAINT [FK___TaxonomyTermPost__B];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkToFavs] DROP CONSTRAINT [FK___WorkToFavs__A];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkToFavs] DROP CONSTRAINT [FK___WorkToFavs__B];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkToLikes] DROP CONSTRAINT [FK___WorkToLikes__A];

-- DropForeignKey
ALTER TABLE [dbo].[_WorkToLikes] DROP CONSTRAINT [FK___WorkToLikes__B];

-- DropForeignKey
ALTER TABLE [dbo].[accounts] DROP CONSTRAINT [FK__accounts__user_id];

-- DropForeignKey
ALTER TABLE [dbo].[comments] DROP CONSTRAINT [FK__comments__creator_id];

-- DropForeignKey
ALTER TABLE [dbo].[comments] DROP CONSTRAINT [FK__comments__cycle_id];

-- DropForeignKey
ALTER TABLE [dbo].[comments] DROP CONSTRAINT [FK__comments__post_id];

-- DropForeignKey
ALTER TABLE [dbo].[comments] DROP CONSTRAINT [FK__comments__work_id];

-- DropForeignKey
ALTER TABLE [dbo].[cycle_complementary_materials] DROP CONSTRAINT [FK__cycle_complementary_materials__cycle_id];

-- DropForeignKey
ALTER TABLE [dbo].[cycles] DROP CONSTRAINT [FK__cycles__creator_id];

-- DropForeignKey
ALTER TABLE [dbo].[guidelines] DROP CONSTRAINT [FK__guidelines__cycle_id];

-- DropForeignKey
ALTER TABLE [dbo].[posts] DROP CONSTRAINT [FK__posts__creator_id];

-- DropForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] DROP CONSTRAINT [FK__ratingOnCycleId__cycleId];

-- DropForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] DROP CONSTRAINT [FK__ratingOnCycleId__userId];

-- DropForeignKey
ALTER TABLE [dbo].[sessions] DROP CONSTRAINT [FK__sessions__user_id];

-- DropForeignKey
ALTER TABLE [dbo].[taxonomies] DROP CONSTRAINT [FK__taxonomies__creator_id];

-- DropForeignKey
ALTER TABLE [dbo].[terms] DROP CONSTRAINT [FK__terms__taxonomy_code];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__accounts__id', N'accounts_pkey';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__comments__id', N'comments_pkey';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__cycle_complementary_materials__id', N'cycle_complementary_materials_pkey';

-- AlterTable
ALTER TABLE [dbo].[cycles] DROP CONSTRAINT [DF__cycles__access];
EXEC SP_RENAME N'dbo.PK__cycles__id', N'cycles_pkey';
ALTER TABLE [dbo].[cycles] ADD CONSTRAINT [cycles_access_df] DEFAULT 1 FOR [access];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__CycleWork__id', N'CycleWork_pkey';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__guidelines__id', N'guidelines_pkey';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__local_images__id', N'local_images_pkey';

-- AlterTable
EXEC SP_RENAME N'dbo.PK__posts__id', N'posts_pkey';

-- AlterTable
ALTER TABLE [dbo].[ratingOnCycleId] DROP CONSTRAINT [DF__ratingOnCycleId__qty];
EXEC SP_RENAME N'dbo.PK__ratingOnCycleId__id', N'ratingOnCycleId_pkey';
ALTER TABLE [dbo].[ratingOnCycleId] ADD CONSTRAINT [ratingOnCycleId_qty_df] DEFAULT 0 FOR [qty];

-- AlterTable
ALTER TABLE [dbo].[ratingOnWorkId] DROP CONSTRAINT [DF__ratingOnWorkId__qty];
EXEC SP_RENAME N'dbo.PK__ratingOnWorkId__id', N'ratingOnWorkId_pkey';
ALTER TABLE [dbo].[ratingOnWorkId] ADD CONSTRAINT [ratingOnWorkId_qty_df] DEFAULT 0 FOR [qty];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__sessions__id', N'sessions_pkey';

-- AlterTable
ALTER TABLE [dbo].[taxonomies] DROP CONSTRAINT [DF__taxonomies__weight];
EXEC SP_RENAME N'dbo.PK__taxonomies__id', N'taxonomies_pkey';
ALTER TABLE [dbo].[taxonomies] ADD CONSTRAINT [taxonomies_weight_df] DEFAULT 1 FOR [weight];

-- AlterTable
ALTER TABLE [dbo].[terms] DROP CONSTRAINT [DF__terms__taxonomy_code],
[DF__terms__weight];
EXEC SP_RENAME N'dbo.PK__terms__id', N'terms_pkey';
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [terms_taxonomy_code_df] DEFAULT 'region' FOR [taxonomy_code], CONSTRAINT [terms_weight_df] DEFAULT 1 FOR [weight];

-- AlterTable
ALTER TABLE [dbo].[users] DROP CONSTRAINT [DF__users__dashboard_type],
[DF__users__roles];
EXEC SP_RENAME N'dbo.PK__users__id', N'users_pkey';
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_dashboard_type_df] DEFAULT 1 FOR [dashboard_type], CONSTRAINT [users_roles_df] DEFAULT 'member' FOR [roles];

-- AlterTable
EXEC SP_RENAME N'dbo.PK__verification_requests__id', N'verification_requests_pkey';

-- AlterTable
ALTER TABLE [dbo].[works] DROP CONSTRAINT [DF__works__creator_id];
EXEC SP_RENAME N'dbo.PK__works__id', N'works_pkey';
ALTER TABLE [dbo].[works] ADD CONSTRAINT [works_creator_id_df] DEFAULT 1 FOR [creator_id];

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__comments__commentId', 'comments_commentId_fkey', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__CycleWork__cycleId', 'CycleWork_cycleId_fkey', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__CycleWork__workId', 'CycleWork_workId_fkey', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__ratingOnWorkId__userId', 'ratingOnWorkId_userId_fkey', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__ratingOnWorkId__workId', 'ratingOnWorkId_workId_fkey', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__terms__creator_id', 'terms_creator_id_fkey', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__terms__parent_id', 'terms_parent_id_fkey', 'OBJECT';

-- AddForeignKey
ALTER TABLE [dbo].[accounts] ADD CONSTRAINT [accounts_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[sessions] ADD CONSTRAINT [sessions_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cycle_complementary_materials] ADD CONSTRAINT [cycle_complementary_materials_cycle_id_fkey] FOREIGN KEY ([cycle_id]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cycles] ADD CONSTRAINT [cycles_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[guidelines] ADD CONSTRAINT [guidelines_cycle_id_fkey] FOREIGN KEY ([cycle_id]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [posts_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_cycle_id_fkey] FOREIGN KEY ([cycle_id]) REFERENCES [dbo].[cycles]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_work_id_fkey] FOREIGN KEY ([work_id]) REFERENCES [dbo].[works]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_post_id_fkey] FOREIGN KEY ([post_id]) REFERENCES [dbo].[posts]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[taxonomies] ADD CONSTRAINT [taxonomies_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[terms] ADD CONSTRAINT [terms_taxonomy_code_fkey] FOREIGN KEY ([taxonomy_code]) REFERENCES [dbo].[taxonomies]([code]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] ADD CONSTRAINT [ratingOnCycleId_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ratingOnCycleId] ADD CONSTRAINT [ratingOnCycleId_cycleId_fkey] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToParticipant] ADD CONSTRAINT [FK___CycleToParticipant__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToParticipant] ADD CONSTRAINT [FK___CycleToParticipant__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLikes] ADD CONSTRAINT [FK___CycleToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToLikes] ADD CONSTRAINT [FK___CycleToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToFavs] ADD CONSTRAINT [FK___CycleToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToFavs] ADD CONSTRAINT [FK___CycleToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToLikes] ADD CONSTRAINT [FK___WorkToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToLikes] ADD CONSTRAINT [FK___WorkToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToFavs] ADD CONSTRAINT [FK___WorkToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_WorkToFavs] ADD CONSTRAINT [FK___WorkToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[works]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToLikes] ADD CONSTRAINT [FK___PostToLikes__A] FOREIGN KEY ([A]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToLikes] ADD CONSTRAINT [FK___PostToLikes__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToFavs] ADD CONSTRAINT [FK___PostToFavs__A] FOREIGN KEY ([A]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_PostToFavs] ADD CONSTRAINT [FK___PostToFavs__B] FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToPost] ADD CONSTRAINT [FK___CycleToPost__A] FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToPost] ADD CONSTRAINT [FK___CycleToPost__B] FOREIGN KEY ([B]) REFERENCES [dbo].[posts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermCycle] ADD CONSTRAINT [FK___TaxonomyTermCycle__B] FOREIGN KEY ([B]) REFERENCES [dbo].[terms]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaxonomyTermPost] ADD CONSTRAINT [FK___TaxonomyTermPost__B] FOREIGN KEY ([B]) REFERENCES [dbo].[terms]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
EXEC SP_RENAME N'dbo.accounts.accounts_compound_id_unique', N'accounts_compound_id_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.sessions.sessions_access_token_unique', N'sessions_access_token_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.sessions.sessions_session_token_unique', N'sessions_session_token_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.taxonomies.taxonomies_code_unique', N'taxonomies_code_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.users.users_email_unique', N'users_email_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.verification_requests.verification_requests_token_unique', N'verification_requests_token_key', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
