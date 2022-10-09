import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { isValidId } from '../../../utils'
import prisma from '../../../lib/prisma'
import sessionSchema from '../../../validation/sessionSchema'

const handler = nc()
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query

    if (!isValidId(id)) {
      return res.status(400).json({})
    }

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
        // Missing student from body
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
      lesson: { connect: body.lesson },
      students: {
        deleteMany: {},
        create: students
      }
    }

    await prisma.session.update({
      where: {
        id: Number(id)
      },
      data: body
    })

    res.json({})
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query

    if (!isValidId(id)) {
      return res.status(400).json({})
    }

    try {
      await prisma.session.delete({
        where: {
          id: Number(id)
        }
      })
    } catch (error) {
      if ((error as any).code === 'P2025') {
        return res.status(404).json({})
      }
    }
    res.json({})
  })

export default handler
