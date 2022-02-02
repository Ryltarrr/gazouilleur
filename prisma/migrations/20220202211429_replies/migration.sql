-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postRepliedId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postRepliedId_fkey" FOREIGN KEY ("postRepliedId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
