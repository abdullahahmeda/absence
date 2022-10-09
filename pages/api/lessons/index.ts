import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import lessonSchema from '../../../validation/lessonScehma'
import prisma from '../../../lib/prisma'

const handler = nc().post(async (req: NextApiRequest, res: NextApiResponse) => {
  let body
  try {
    body = await lessonSchema.validate(req.body, { stripUnknown: true })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }

  body = {
    ...body,
    teacher: { connect: body.teacher },
    students: {
      create: body.students.map(s => ({ student: { connect: s } }))
    }
  }

  await prisma.lesson.create({
    data: body
  })

  res.json({})
})

export default handler
