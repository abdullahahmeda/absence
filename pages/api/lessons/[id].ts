import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { isValidId } from '../../../utils'
import prisma from '../../../lib/prisma'
import lessonSchema from '../../../validation/lessonScehma'

const handler = nc()
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query

    if (!isValidId(id)) {
      console.log(id)
      return res.status(400).json({})
    }

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
        deleteMany: {},
        create: body.students.map(s => ({ student: { connect: s } }))
      }
    }

    await prisma.lesson.update({
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
      await prisma.lesson.delete({
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
