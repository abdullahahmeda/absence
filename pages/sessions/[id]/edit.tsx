import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm, useController } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import { Lesson, Session, Student } from '@prisma/client'
import { DevTool } from '@hookform/devtools'
import prisma from 'lib/prisma'
import sessionSchema from 'validation/sessionSchema'
import DatePicker from 'components/DatePicker'
import { GetServerSideProps } from 'next'
import { isValidId } from 'utils'

type FormValues = {
  lesson: null | Lesson
  title: string
  date: Date | null
  students: {
    [key: number]: {
      present: boolean
      count: boolean
    }
  }
}

type Props = {
  _session: {
    lesson: Lesson
    date: Date
    students: {
      student: Student
      present: boolean
    }[]
    id: number
  }
  students: Student[]
}

const EditSession = ({ _session: session, students }: Props) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      lesson: null,
      title: '',
      date: null,
      students: {}
    },
    resolver: yupResolver(sessionSchema)
  })
  console.log(session)

  const {
    field: { onChange: _, value: __ }
  } = useController({
    control,
    name: 'lesson'
  })
  const {
    field: { onChange: dateOnChange, value: selectedDate }
  } = useController({
    control,
    name: 'date'
  })

  useEffect(() => {
    const studentsObject: {
      [k: number]: { present: boolean; count: boolean }
    } = {}
    for (const s of session.students) {
      console.log(s)
      studentsObject[s.student.id] = {
        present: s.present,
        count: true
      }
    }
    for (const s of students) {
      if (studentsObject[s.id] === undefined) {
        studentsObject[s.id] = {
          present: false,
          count: false
        }
      }
    }
    console.log(studentsObject)
    reset({
      ...session,
      students: studentsObject
    })
  }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.patch(`/api/sessions/${session.id}`, data)
      toast.success('تم تعديل الجلسة بنجاح.')
      router.push('/sessions')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>تعديل جلسة</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>تعديل جلسة</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label>الدرس</label>
            <p>{session.lesson.name}</p>
          </div>
          <div className='mb-2'>
            <label htmlFor='name'>العنوان</label>
            <input
              type='text'
              {...register('title')}
              id='name'
              className='block w-full input'
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.title?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='name'>تاريخ الجلسة</label>
            <DatePicker onChange={dateOnChange} selected={selectedDate} />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.date?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='students'>الحضور</label>
            {students.map(student => (
              <div key={student.id} className='flex items-center mb-1'>
                <input
                  type='checkbox'
                  id={`student-${student.id}`}
                  {...register(`students.${student.id}.present`)}
                  className='ml-2 p-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50'
                />
                <label htmlFor={`student-${student.id}`}>{student.name}</label>
              </div>
            ))}
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.students?.message}
            </p>
          </div>
          <DevTool control={control} />
          <LoadingButton
            isLoading={isSubmitting}
            className='px-3 py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-50 text-white focus:ring focus:ring-blue-600 focus:ring-opacity-30'
          >
            تعديل
          </LoadingButton>
        </form>
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
    select: {
      id: true,
      title: true,
      date: true,
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

  const students = await prisma.student.findMany({
    where: {
      lessons: {
        some: {
          lessonId: session.lesson.id
        }
      }
    }
  })

  return {
    props: {
      _session: session,
      students
    }
  }
}

export default EditSession
