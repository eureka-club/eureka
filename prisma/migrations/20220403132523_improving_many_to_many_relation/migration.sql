/*
  Warnings:

  - The primary key for the `CycleUserJoin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CycleUserJoin` table. All the data in the column will be lost.
  - Made the column `cycleId` on table `CycleUserJoin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `CycleUserJoin` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CycleUserJoin] DROP CONSTRAINT [CycleUserJoin_cycleId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CycleUserJoin] DROP CONSTRAINT [CycleUserJoin_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[CycleUserJoin] DROP CONSTRAINT [CycleUserJoin_pkey];
ALTER TABLE [dbo].[CycleUserJoin] ALTER COLUMN [cycleId] INT NOT NULL;
ALTER TABLE [dbo].[CycleUserJoin] ALTER COLUMN [userId] INT NOT NULL;
ALTER TABLE [dbo].[CycleUserJoin] DROP COLUMN [id];
ALTER TABLE [dbo].[CycleUserJoin] ADD CONSTRAINT CycleUserJoin_pkey PRIMARY KEY ([cycleId],[userId]);

-- AddForeignKey
ALTER TABLE [dbo].[CycleUserJoin] ADD CONSTRAINT [CycleUserJoin_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CycleUserJoin] ADD CONSTRAINT [CycleUserJoin_cycleId_fkey] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
