import nc from 'next-connect'
import { unstable_getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from './auth/[...nextauth]'
import prisma from 'lib/prisma'
import profileSchema from 'validation/profileSchema'
import bcrypt from 'bcryptjs'

const handler = nc().patch(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(403).json({})
    }

    let body

    try {
      body = await profileSchema.validate(req.body, { stripUnknown: true })
    } catch (error) {
      console.log(error)
      return res.status(400).json({})
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          username: session.user.username
        }
      })
      if (!user) {
        return res.status(404).json({})
      }
      const isCorrectPassword = await bcrypt.compare(
        body.currentPassword,
        user.password
      )
      if (!isCorrectPassword) {
        return res.status(400).json({})
      }
    } catch (error) {
      return res.status(500).json({})
    }

    const newPassword = await bcrypt.hash(body.newPassword, 10)

    try {
      await prisma.user.update({
        where: {
          username: session.user.username
        },
        data: {
          password: newPassword
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({})
    }
    res.json({})
  }
)

export default handler
