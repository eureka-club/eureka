/*
  Warnings:

  - Added the required column `is_public` to the `cycles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE [dbo].[cycles] ADD [is_public] BIT NOT NULL;
