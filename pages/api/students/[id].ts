import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { isValidId } from '../../../utils'
import studentSchema from '../../../validation/studentSchema'
import prisma from '../../../lib/prisma'

const handler = nc()
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query

    if (!isValidId(id)) {
      return res.status(400).json({})
    }

    let body

    try {
      body = await studentSchema.validate(req.body, { stripUnknown: true })
    } catch (error) {
      console.log(error)
      return res.status(400).json({})
    }

    await prisma.student.update({
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
      await prisma.student.delete({
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
