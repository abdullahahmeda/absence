import { Lesson, Session, Teacher } from '@prisma/client'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RowActions from '../../components/RowActions'
import { useConfirm } from '../../lib/confirm'
import prisma from '../../lib/prisma'

type Props = {
  lessons: (Lesson & { teacher: Teacher; sessions: Session[] })[]
}

const Lessons = ({ lessons }: Props) => {
  const confirm = useConfirm()
  const confirmDelete = (lesson: Lesson) => {
    confirm({
      description: 'هذا سيحذف سجلات حضور هذا الدرس أيضاً'
    }).then(() => {
      const t = toast.loading(`جاري حذف الدرس ${lesson.name}...`)
      axios
        .delete(`/api/lessons/${lesson.id}`)
        .then(() => {
          toast.success(`تم حذف الدرس ${lesson.name} بنجاح.`)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            toast.error(`الدرس ${lesson.name} غير موجود في قاعدة البيانات.`)
            return
          }
          toast.error(`حدث خطأ أثناء حذف الدرس ${lesson.name}.`)
        })
        .finally(() => {
          toast.dismiss(t)
        })
    })
  }
  return (
    <>
      <Head>
        <title>الدروس</title>
      </Head>
      <div>
        <div className='flex mb-2'>
          <h1 className='ml-3 text-3xl font-bold'>الدروس</h1>
          <Link href='/students/create'>
            <a className='btn-primary'>إضافة درس</a>
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
                  الشيخ
                </th>
                <th scope='col' className='py-3 px-6 xrounded-tl-lg'>
                  عدد الجلسات
                </th>
                <th scope='col' className='py-3 px-6 rounded-tl-lg'>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(lesson => {
                return (
                  <tr
                    className='bg-white border-b last-of-type:border-b-0'
                    key={lesson.id}
                  >
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {lesson.name}
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {lesson.teacher.name}
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {lesson.sessions.length}
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      <RowActions
                        editLink={`/lessons/${lesson.id}/edit`}
                        onDelete={() => confirmDelete(lesson)}
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
  const lessons = await prisma.lesson.findMany({
    include: {
      teacher: true,
      sessions: {
        select: {
          id: true
        }
      }
    }
  })

  return {
    props: {
      lessons
    }
  }
}

export default Lessons
