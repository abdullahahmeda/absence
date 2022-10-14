import { GetServerSideProps } from 'next'
import prisma from 'lib/prisma'
import { isValidId } from 'utils'
import {
  Lesson as LessonSchema,
  Session,
  Student,
  Teacher
} from '@prisma/client'
import Head from 'next/head'

type Props = {
  lesson: LessonSchema & {
    teacher: Teacher
    students: {
      student: Student
    }[]
    sessions: Session[]
  }
}

const Lesson = ({ lesson }: Props) => {
  return (
    <>
      <Head>
        <title>الدرس ({lesson.name})</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <p>
          اسم الدرس: <span className='font-bold'>{lesson.name}</span>
        </p>
        <p>
          الشيخ الشارح: <span className='font-bold'>{lesson.teacher.name}</span>
        </p>
        {/* <p></p> */}
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
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      teacher: true,
      students: {
        select: {
          student: true
        }
      },
      sessions: {
        take: 5
      }
    }
  })

  if (!lesson) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      lesson
    }
  }
}

export default Lesson
