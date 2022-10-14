import { Lesson, Session, SessionStudents } from '@prisma/client'
import { format } from 'date-fns'
import Head from 'next/head'
import Link from 'next/link'
import RowActions from 'components/RowActions'
import { useConfirm } from 'lib/confirm'
import prisma from 'lib/prisma'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useState } from 'react'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'

type Props = {
  sessions: (Session & { lesson: Lesson } & { students: SessionStudents[] })[]
}

const renderProgressClassName = (percentage: number) => {
  if (percentage <= 25) return 'bg-red-600'
  else if (percentage <= 50) return 'bg-yellow-500'
  else if (percentage <= 75) return 'bg-green-500'
  return 'bg-blue-600'
}

const Students = ({ sessions }: Props) => {
  const [visibleSessions, setVisibleSessions] = useState(sessions)

  const { status } = useSession()
  const confirm = useConfirm()
  const confirmDelete = (session: Session) => {
    confirm({
      description: 'هذا سيحذف سجلات حضور هذا الجلسة أيضاً'
    }).then(() => {
      const t = toast.loading(`جاري حذف الجلسة ${session.title}...`)
      axios
        .delete(`/api/sessions/${session.id}`)
        .then(() => {
          const newSessions = visibleSessions.filter(s => s.id !== session.id)
          setVisibleSessions(newSessions)
          toast.success(`تم حذف الجلسة ${session.title} بنجاح.`)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            toast.error(`الجلسة ${session.title} غير موجود في قاعدة البيانات.`)
            return
          }
          toast.error(`حدث خطأ أثناء حذف الجلسة ${session.title}.`)
        })
        .finally(() => {
          toast.dismiss(t)
        })
    })
  }
  return (
    <>
      <Head>
        <title>الجلسات</title>
      </Head>
      <div>
        <div className='flex mb-2'>
          <h1 className='ml-3 text-3xl font-bold'>الجلسات</h1>
          {status === 'authenticated' && (
            <Link href='/sessions/create'>
              <a className='btn-primary'>إضافة جلسة</a>
            </Link>
          )}
        </div>
        <div className='overflow-x-auto relative'>
          <table className='w-full text-sm text-right text-gray-500 mb-2'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
              <tr>
                <th scope='col' className='py-3 px-6 rounded-tr-lg'>
                  العنوان
                </th>
                <th scope='col' className='py-3 px-6'>
                  التاريخ
                </th>
                <th scope='col' className='py-3 px-6'>
                  الجلسة
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
              {visibleSessions.map(session => {
                const presencePercentage =
                  (session.students.reduce(
                    (acc, v) => (v.present ? acc + 1 : acc),
                    0
                  ) /
                    session.students.length) *
                  100

                return (
                  <tr
                    className='bg-white border-b last-of-type:border-b-0'
                    key={session.id}
                  >
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {session.title}
                    </td>
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {format(session.date, 'dd-MM-yyyy')}
                    </td>
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {session.lesson.name}
                    </td>
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
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
                    </td>
                    {status === 'authenticated' && (
                      <td>
                        <RowActions
                          editLink={`/sessions/${session.id}/edit`}
                          onDelete={() => confirmDelete(session)}
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
  const sessions = await prisma.session.findMany({
    include: {
      lesson: true,
      students: true
    }
  })

  return {
    props: {
      session,
      sessions: sessions
    }
  }
}

export default Students
