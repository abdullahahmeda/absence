-- DropIndex
DROP INDEX "LessonStudents_lessonId_studentId_idx";

-- DropIndex
DROP INDEX "Session_lessonId_date_idx";

-- DropIndex
DROP INDEX "SessionStudents_sessionId_studentId_present_idx";

-- CreateIndex
CREATE INDEX "LessonStudents_lessonId_idx" ON "LessonStudents"("lessonId");

-- CreateIndex
CREATE INDEX "LessonStudents_studentId_idx" ON "LessonStudents"("studentId");

-- CreateIndex
CREATE INDEX "Session_lessonId_idx" ON "Session"("lessonId");

-- CreateIndex
CREATE INDEX "Session_date_idx" ON "Session"("date");

-- CreateIndex
CREATE INDEX "SessionStudents_sessionId_idx" ON "SessionStudents"("sessionId");

-- CreateIndex
CREATE INDEX "SessionStudents_studentId_idx" ON "SessionStudents"("studentId");

-- CreateIndex
CREATE INDEX "SessionStudents_present_idx" ON "SessionStudents"("present");
