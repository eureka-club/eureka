BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CycleUserJoin] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cycleId] INT,
    [userId] INT,
    [pending] BIT CONSTRAINT [CycleUserJoin_pending_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [CycleUserJoin_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [CycleUserJoin_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CycleUserJoin] ADD CONSTRAINT [CycleUserJoin_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CycleUserJoin] ADD CONSTRAINT [CycleUserJoin_cycleId_fkey] FOREIGN KEY ([cycleId]) REFERENCES [dbo].[cycles]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
