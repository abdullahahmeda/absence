-- DropIndex
DROP INDEX "SessionStudents_sessionId_studentId_idx";

-- CreateIndex
CREATE INDEX "SessionStudents_sessionId_studentId_present_idx" ON "SessionStudents"("sessionId", "studentId", "present");
