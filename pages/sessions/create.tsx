import { ReactNode, useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm, useController } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import { Lesson, Student } from '@prisma/client'
import { DevTool } from '@hookform/devtools'
import prisma from 'lib/prisma'
import sessionSchema from 'validation/sessionSchema'
import DatePicker from 'components/DatePicker'
import RtlSelect from 'components/RtlSelect'
import { CgSpinner } from 'react-icons/cg'

type FormValues = {
  lesson: null | Lesson
  title: string
  date: Date | null
  students: any
  // students: {
  //   [key: number]: {
  //     present: boolean
  //     count: boolean
  //   }
  // }
}

type Props = {
  lessons: Lesson[]
}

const CreateSession = ({ lessons }: Props) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  const [students, setStudents] = useState<Student[]>([])
  const [isStudentsLoading, setIsStudentsLoading] = useState(false)

  const {
    field: { onChange: dateOnChange, value: selectedDate }
  } = useController({
    control,
    name: 'date'
  })

  const {
    field: { value: selectedLesson, onChange: lessonOnChange }
  } = useController({
    control,
    name: 'lesson'
  })

  useEffect(() => {
    if (students.length > 0) {
      const studentsObjects = students.reduce(
        (obj, s) => ({
          ...obj,
          [s.id]: {
            present: false,
            count: true
          }
        }),
        {}
      )
      setValue('students', studentsObjects)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students])

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/api/sessions', data)
      toast.success('تم إضافة الجلسة بنجاح.')
      router.push('/sessions')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>إضافة جلسة</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>إضافة جلسة</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label htmlFor='lesson'>الدرس</label>
            <RtlSelect
              id='lesson'
              instanceId='lesson'
              options={lessons}
              getOptionLabel={(l: any) => l.name}
              getOptionValue={(l: any) => `${l.id}`}
              value={selectedLesson}
              onChange={(lesson: any) => {
                lessonOnChange(lesson)
                setIsStudentsLoading(true)
                setStudents([])
                axios
                  .get(`/api/students?lesson=${lesson?.id}`)
                  .then(({ data }) => {
                    setStudents(data)
                  })
                  .catch(error => {
                    console.log(error)
                    toast.error('حدث خطأ أثناء تحميل الطلاب.')
                  })
                  .finally(() => {
                    setIsStudentsLoading(false)
                  })
              }}
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.lesson?.message}
            </p>
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
            <DatePicker
              onChange={dateOnChange}
              selected={selectedDate}
              className='block w-full input'
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.date?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='students'>الحضور</label>
            {students.length === 0 && !isStudentsLoading && !selectedLesson && (
              <p>يجب اختيار الدرس أولاً.</p>
            )}
            {isStudentsLoading && (
              <div className='flex'>
                <CgSpinner className='animate-spin ml-2 text-2xl text-blue-600' />
                <p>يتم تحميل الطلاب...</p>
              </div>
            )}
            {!isStudentsLoading &&
              students.map(student => (
                <div key={student.id} className='flex items-center mb-1'>
                  <input
                    type='checkbox'
                    id={`student-${student.id}`}
                    {...register(`students.${student.id}.present`)}
                    className='ml-2 p-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50'
                  />
                  <label htmlFor={`student-${student.id}`}>
                    {student.name}
                  </label>
                </div>
              ))}
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.students?.message as ReactNode}
            </p>
          </div>
          <DevTool control={control} />
          <LoadingButton isLoading={isSubmitting} className='btn-primary'>
            إضافة
          </LoadingButton>
        </form>
      </div>
    </>
  )
}

export async function getServerSideProps () {
  const lessons = await prisma.lesson.findMany()
  return {
    props: {
      lessons
    }
  }
}

export default CreateSession
