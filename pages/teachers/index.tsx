import { Lesson, Teacher } from '@prisma/client'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RowActions from 'components/RowActions'
import { useConfirm } from 'lib/confirm'
import prisma from 'lib/prisma'

type Props = {
  teachers: (Teacher & { lessons: Lesson[] })[]
}

const Teachers = ({ teachers }: Props) => {
  const confirm = useConfirm()
  const confirmDelete = (teacher: Teacher) => {
    confirm({
      description: 'هذا سيحذف الدروس الخاصة به أيضاً'
    }).then(() => {
      const t = toast.loading(`جاري حذف الشيخ ${teacher.name}...`)
      axios
        .delete(`/api/teachers/${teacher.id}`)
        .then(() => {
          toast.success(`تم حذف الشيخ ${teacher.name} بنجاح.`)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            toast.error(`الشيخ ${teacher.name} غير موجود في قاعدة البيانات.`)
            return
          }
          toast.error(`حدث خطأ أثناء حذف الشيخ ${teacher.name}.`)
        })
        .finally(() => {
          toast.dismiss(t)
        })
    })
  }
  return (
    <>
      <Head>
        <title>المشايخ</title>
      </Head>
      <div>
        <div className='flex mb-2'>
          <h1 className='ml-3 text-3xl font-bold'>المشايخ</h1>
          <Link href='/students/create' passHref>
            <a className='btn-primary'>إضافة شيخ</a>
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
                  عدد الدروس التي يشرحها
                </th>
                <th scope='col' className='py-3 px-6 rounded-tl-lg'>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => {
                return (
                  <tr
                    className='bg-white border-b last-of-type:border-b-0'
                    key={teacher.id}
                  >
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {teacher.name}
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      {teacher.lessons.length}
                    </th>
                    <th
                      scope='row'
                      className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'
                    >
                      <RowActions
                        editLink={`/teachers/${teacher.id}/edit`}
                        onDelete={() => confirmDelete(teacher)}
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
  const teachers = await prisma.teacher.findMany({
    include: {
      lessons: true
    }
  })

  return {
    props: {
      teachers
    }
  }
}

export default Teachers
