import { LessonStudents, SessionStudents, Student } from '@prisma/client'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RowActions from 'components/RowActions'
import { useConfirm } from 'lib/confirm'
import prisma from 'lib/prisma'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useSession } from 'next-auth/react'
import { unstable_getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { MdGrade } from 'react-icons/md'

type Props = {
  students: (Student & {
    lessons: LessonStudents[]
    sessions: SessionStudents[]
  })[]
}

const renderProgressClassName = (percentage: number) => {
  if (percentage <= 25) return 'bg-red-600'
  else if (percentage <= 50) return 'bg-yellow-500'
  else if (percentage <= 75) return 'bg-green-500'
  return 'bg-blue-600'
}

const Students = ({ students }: Props) => {
  const [visibleStudents, setVisibleStudents] = useState(students)

  const { status } = useSession()
  const confirm = useConfirm()
  const confirmDelete = (student: Student) => {
    confirm({
      description: 'هذا سيحذف سجلات حضوره أيضاً'
    }).then(() => {
      const t = toast.loading(`جاري حذف الطالب ${student.name}...`)
      axios
        .delete(`/api/students/${student.id}`)
        .then(() => {
          const newStudents = visibleStudents.filter(s => s.id !== student.id)
          setVisibleStudents(newStudents)
          toast.success(`تم حذف الطالب ${student.name} بنجاح.`)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            toast.error(`الطالب ${student.name} غير موجود في قاعدة البيانات.`)
            return
          }
          toast.error(`حدث خطأ أثناء حذف الطالب ${student.name}.`)
        })
        .finally(() => {
          toast.dismiss(t)
        })
    })
  }
  return (
    <>
      <Head>
        <title>الطلاب</title>
      </Head>
      <div>
        <div className='flex mb-2'>
          <h1 className='ml-3 text-3xl font-bold'>
            الطلاب ({visibleStudents.length})
          </h1>
          {status === 'authenticated' && (
            <Link href='/students/create'>
              <a className='btn-primary'>إضافة طالب</a>
            </Link>
          )}
        </div>
        <div className='overflow-x-auto relative'>
          <table className='w-full text-sm text-right text-gray-500 mb-2'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
              <tr>
                <th scope='col' className='py-3 px-6 rounded-tr-lg'>
                  الاسم
                </th>
                <th scope='col' className='py-3 px-6'>
                  عدد الدروس المشترك فيها
                </th>
                <th scope='col' className='py-3 px-6 xrounded-tl-lg'>
                  نسبة الحضور
                </th>
                {status === 'authenticated' && (
                  <th scope='col' className='py-3 px-6 rounded-tl-lg'>
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map(student => {
                const presencePercentage =
                  (student.sessions.reduce(
                    (acc, v) => (v.present ? acc + 1 : acc),
                    0
                  ) /
                    student.sessions.length) *
                  100

                return (
                  <tr
                    className='bg-white border-b last-of-type:border-b-0'
                    key={student.id}
                  >
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap flex items-center'
                    >
                      {Number(presencePercentage.toFixed(0)) > 75 && (
                        <MdGrade
                          size={20}
                          className='text-yellow-500'
                          title='ممتاز! نسبة حضور أعلى من 75%'
                        />
                      )}
                      <Link href={`/students/${student.id}`}>
                        <a className='text-blue-600 btn-link'>{student.name}</a>
                      </Link>
                    </td>
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {student.lessons.length}
                    </td>
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {student.sessions.length > 0 ? (
                        <>
                          {presencePercentage.toFixed(0)}%
                          <div className='w-48 bg-gray-200 rounded-full'>
                            <div
                              className={`${renderProgressClassName(
                                presencePercentage
                              )} h-2 rounded-full`}
                              title={`${presencePercentage}%`}
                              style={{
                                width: `${presencePercentage}%`
                              }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        'لم تحسب بعد'
                      )}
                    </td>
                    {status === 'authenticated' && (
                      <td
                        scope='row'
                        className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                      >
                        <RowActions
                          editLink={`/students/${student.id}/edit`}
                          onDelete={() => confirmDelete(student)}
                        />
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const students = await prisma.student.findMany({
    include: {
      lessons: true,
      sessions: true
    }
  })
  return {
    props: {
      session,
      students
    }
  }
}

export default Students
