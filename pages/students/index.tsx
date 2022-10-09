import { LessonStudents, SessionStudents, Student } from '@prisma/client'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RowActions from 'components/RowActions'
import { useConfirm } from 'lib/confirm'
import prisma from 'lib/prisma'

type Props = {
  students: (Student & {
    lessons: LessonStudents[]
    sessions: SessionStudents[]
  })[]
}

const renderProgressClassName = (percentage: Number) => {
  if (percentage <= 25) return 'bg-red-600'
  else if (percentage <= 50) return 'bg-yellow-500'
  else if (percentage <= 75) return 'bg-green-500'
  return 'bg-blue-600'
}

const Students = ({ students }: Props) => {
  const confirm = useConfirm()
  const confirmDelete = (student: Student) => {
    confirm({
      description: 'هذا سيحذف سجلات حضوره أيضاً'
    }).then(() => {
      const t = toast.loading(`جاري حذف الطالب ${student.name}...`)
      axios
        .delete(`/api/students/${student.id}`)
        .then(() => {
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
          <h1 className='ml-3 text-3xl font-bold'>الطلاب</h1>
          <Link href='/students/create'>
            <a className='btn-primary'>إضافة طالب</a>
          </Link>
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
                <th scope='col' className='py-3 px-6 rounded-tl-lg'>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
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
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {student.name}
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {student.lessons.length}
                    </th>
                    <th
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
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      <RowActions
                        editLink={`/students/${student.id}/edit`}
                        onDelete={() => confirmDelete(student)}
                      />
                    </th>
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

export async function getServerSideProps () {
  const students = await prisma.student.findMany({
    include: {
      lessons: true,
      sessions: true
    }
  })
  return {
    props: {
      students
    }
  }
}

export default Students
