import { GetServerSideProps } from 'next'
import { isValidId } from 'utils'
import prisma from 'lib/prisma'
import { Session, Lesson, Student } from '@prisma/client'
import Head from 'next/head'
import { useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'

type Props = {
  _session: Session & {
    lesson: Lesson
    students: {
      student: Student
      present: boolean
    }[]
  }
  presentStudents: {
    student: Student
    present: boolean
  }[]
  absentStudents: {
    student: Student
    present: boolean
  }[]
}

const STUDENTS_TYPES = {
  PRESENT: 1,
  ABSNET: 2
}

const ViewSession = ({
  _session: session,
  presentStudents,
  absentStudents
}: Props) => {
  const [shownStudentsType, setShownStudentsType] = useState(
    STUDENTS_TYPES.PRESENT
  )
  return (
    <>
      <Head>
        <title>الجلسة ({session.title})</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <p>اسم الجلسة: {session.title}</p>
        <p>الدرس: {session.lesson.name}</p>
        <p>التاريخ: {format(session.date, 'EEEE d LLLL yyyy')}</p>
      </div>
      <div className='bg-gray-100 rounded-lg p-3 mt-2'>
        <button
          className={`px-3 py-2 transition-colors rounded ${
            STUDENTS_TYPES.PRESENT === shownStudentsType
              ? 'bg-blue-200'
              : 'hover:bg-blue-200'
          }`}
          onClick={() => setShownStudentsType(STUDENTS_TYPES.PRESENT)}
        >
          الحضور ({presentStudents.length})
        </button>
        <button
          className={`px-3 py-2 transition-colors rounded mr-1 ${
            STUDENTS_TYPES.ABSNET === shownStudentsType
              ? 'bg-blue-200'
              : 'hover:bg-blue-200'
          }`}
          onClick={() => setShownStudentsType(STUDENTS_TYPES.ABSNET)}
        >
          الغياب ({absentStudents.length})
        </button>
        <div className='mt-2'>
          {(shownStudentsType === STUDENTS_TYPES.PRESENT
            ? presentStudents
            : absentStudents
          ).map(({ student }) => (
            <div key={student.id}>
              <Link href={`/students/${student.id}`}>
                <a className='btn-link text-blue-600 inline-block'>
                  {student.name}
                </a>
              </Link>
            </div>
          ))}
        </div>
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

  const session = await prisma.session.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      lesson: true,
      students: {
        select: {
          student: true,
          present: true
        }
      }
    }
  })

  if (!session) {
    return {
      notFound: true
    }
  }

  const presentStudents = session.students.filter(s => s.present)
  const absentStudents = session.students.filter(s => !s.present)

  return {
    props: {
      _session: session,
      presentStudents,
      absentStudents
    }
  }
}

export default ViewSession
