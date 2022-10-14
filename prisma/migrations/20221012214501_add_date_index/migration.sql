-- DropIndex
DROP INDEX "Session_lessonId_idx";

-- CreateIndex
CREATE INDEX "Session_lessonId_date_idx" ON "Session"("lessonId", "date");
