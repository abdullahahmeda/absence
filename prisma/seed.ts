import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  const password = await bcrypt.hash('1234', 10)
  try {
    await prisma.user.create({
      data: {
        id: 'adminuser',
        name: 'Admin User',
        username: 'admin',
        password
      }
    })
  } catch (error) {
    if ((error as any).code === 'P2002') {
      console.log('Admin user already exists.')
    } else {
      console.log(error)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
