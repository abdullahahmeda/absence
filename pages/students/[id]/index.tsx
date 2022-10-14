import { GetServerSideProps } from 'next'
import prisma from 'lib/prisma'
import { isValidId } from 'utils'
import { Session, Student as StudentSchema } from '@prisma/client'
import Head from 'next/head'

type Props = {
  student: StudentSchema & {
    sessions: {
      session: Session
    }[]
  }
}

const Student = ({ student }: Props) => {
  return (
    <>
      <Head>
        <title>الطالب ({student.name})</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <p>
          اسم الطالب: <span className='font-bold'>{student.name}</span>
        </p>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query
  if (!isValidId(id)) {
    return {
      notFound: true
    }
  }
  const student = await prisma.student.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      sessions: {
        take: 5,
        where: {
          present: true
        },
        select: {
          session: true
        },
        orderBy: {
          session: {
            date: 'asc'
          }
        }
      }
    }
  })

  if (!student) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      student
    }
  }
}

export default Student
