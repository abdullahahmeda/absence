import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm, useController } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import { isValidId } from 'utils'
import lessonSchema from 'validation/lessonScehma'
import prisma from 'lib/prisma'
import { Lesson, Student, Teacher } from '@prisma/client'
import RtlSelect from 'components/RtlSelect'
import { DevTool } from '@hookform/devtools'

type FormValues = {
  name: string
  students: Student[]
  teacher: Teacher | null
}

const defaultValues = {
  name: '',
  students: [],
  teacher: null
}

type Props = {
  lesson: Lesson & {
    teacher: Teacher
    students: Student[]
  }
  students: Student[]
  teachers: Teacher[]
}

const EditLesson = ({ lesson, teachers, students }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(lessonSchema)
  })

  const router = useRouter()

  const {
    field: { value: selectedTeacher, onChange: teacherOnChange }
  } = useController({
    control,
    name: 'teacher'
  })

  const {
    field: { value: selectedStudents, onChange: studentsOnChange }
  } = useController({
    control,
    name: 'students'
  })

  useEffect(() => {
    reset(lesson)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.patch(`/api/lessons/${lesson.id}`, data)
      toast.success('تم تعديل الدرس بنجاح.')
      router.push('/lessons')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>تعديل درس</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>تعديل درس</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label htmlFor='name'>الاسم</label>
            <input
              type='text'
              {...register('name')}
              id='name'
              className='block w-full input'
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.name?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='teacher'>الشيخ</label>
            <RtlSelect
              id='teacher'
              instanceId='teacher'
              options={teachers}
              getOptionLabel={(t: any) => t.name}
              getOptionValue={(t: any) => `${t.id}`}
              value={selectedTeacher}
              onChange={teacherOnChange}
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.teacher?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='students'>الطلاب</label>
            <RtlSelect
              id='students'
              instanceId='students'
              options={students}
              getOptionLabel={(s: any) => s.name}
              getOptionValue={(s: any) => `${s.id}`}
              isRtl
              isMulti
              value={selectedStudents}
              onChange={studentsOnChange}
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.students?.message}
            </p>
          </div>
          <DevTool control={control} />
          <LoadingButton className='btn-primary' isLoading={isSubmitting}>
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
  const _lesson = await prisma.lesson.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      id: true,
      name: true,
      teacher: true,
      students: {
        select: {
          student: true
        }
      }
    }
  })

  if (!_lesson) {
    return {
      notFound: true
    }
  }

  const lesson = {
    ..._lesson,
    students: _lesson.students.map(s => s.student)
  }

  const teachers = await prisma.teacher.findMany()
  const students = await prisma.student.findMany()

  return {
    props: {
      lesson,
      teachers,
      students
    }
  }
}

export default EditLesson
