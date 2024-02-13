/*
  Warnings:

  - Changed the type of `message` on the `messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "message",
ADD COLUMN     "message" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "_MessagesToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessagesToUsers_AB_unique" ON "_MessagesToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_MessagesToUsers_B_index" ON "_MessagesToUsers"("B");

-- AddForeignKey
ALTER TABLE "_MessagesToUsers" ADD CONSTRAINT "_MessagesToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesToUsers" ADD CONSTRAINT "_MessagesToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
