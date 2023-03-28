-- CreateTable
CREATE TABLE [dbo].[_CycleToParticipant] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CycleToParticipant_AB_unique] UNIQUE ([A],[B])
);

-- CreateIndex
CREATE INDEX [_CycleToParticipant_B_index] ON [dbo].[_CycleToParticipant]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToParticipant]
  ADD CONSTRAINT [FK___CycleToParticipant__A]
  FOREIGN KEY ([A]) REFERENCES [dbo].[cycles]([id]);

-- AddForeignKey
ALTER TABLE [dbo].[_CycleToParticipant]
  ADD CONSTRAINT [FK___CycleToParticipant__B]
  FOREIGN KEY ([B]) REFERENCES [dbo].[users]([id]);
