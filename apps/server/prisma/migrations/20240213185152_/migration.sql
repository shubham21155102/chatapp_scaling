/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_MessagesToUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MessagesToUsers" DROP CONSTRAINT "_MessagesToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessagesToUsers" DROP CONSTRAINT "_MessagesToUsers_B_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "user_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MessagesToUsers";
