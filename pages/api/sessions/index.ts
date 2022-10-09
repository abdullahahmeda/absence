import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import sessionSchema from '../../../validation/sessionSchema'
import prisma from '../../../lib/prisma'

const handler = nc().post(async (req: NextApiRequest, res: NextApiResponse) => {
  let body
  try {
    body = await sessionSchema.validate(req.body, { stripUnknown: true })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }
  const lessonStudents = await prisma.lessonStudents.findMany({
    where: {
      lessonId: body.lesson.id
    },
    select: {
      studentId: true
    }
  })

  const students = []
  for (const s of lessonStudents) {
    if (body.students[s.studentId] === undefined) {
      return res.status(400).json({})
    }
    if (body.students[s.studentId].count) {
      students.push({
        student: { connect: { id: s.studentId } },
        present: body.students[s.studentId].present
      })
    }
  }

  body = {
    ...body,
    students: {
      create: students
    },
    lesson: {
      connect: body.lesson
    }
  }
  await prisma.session.create({
    data: body
  })

  res.json({})
})

export default handler
