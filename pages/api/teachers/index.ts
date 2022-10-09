import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import teacherSchema from '../../../validation/teacherSchema'
import prisma from '../../../lib/prisma'

const handler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const teachers = await prisma.teacher.findMany()
    res.json(teachers)
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    let body
    try {
      body = await teacherSchema.validate(req.body, { stripUnknown: true })
    } catch (error) {
      console.log(error)
      return res.status(400).json({})
    }

    await prisma.teacher.create({
      data: body
    })

    res.json({})
  })

export default handler
