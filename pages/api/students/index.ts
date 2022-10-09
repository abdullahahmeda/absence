import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import studentSchema from '../../../validation/studentSchema'
import prisma from '../../../lib/prisma'
import studentsArgs from '../../../validation/studentsArgs'

const handler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const args: any = {}
    if (
      req.query?.lesson &&
      (await studentsArgs.lesson.isValid(req.query.lesson))
    )
      args.where = {
        ...args.where,
        lessons: {
          some: {
            lessonId: Number(req.query.lesson)
          }
        }
      }
    const students = await prisma.student.findMany(args)
    res.json(students)
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    let body
    try {
      body = await studentSchema.validate(req.body, { stripUnknown: true })
    } catch (error) {
      console.log(error)
      return res.status(400).json({})
    }

    await prisma.student.create({
      data: body
    })

    res.json({})
  })

export default handler
