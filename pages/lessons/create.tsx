import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useController, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import { Student, Teacher } from '@prisma/client'
import { DevTool } from '@hookform/devtools'
import prisma from 'lib/prisma'
import RtlSelect from 'components/RtlSelect'
import lessonSchema from 'validation/lessonScehma'

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
  teachers: Teacher[]
  students: Student[]
}

const CreateLesson = ({ teachers, students }: Props) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(lessonSchema)
  })

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

  const onSubmit = async (_data: FormValues) => {
    const data = {
      ..._data,
      students: _data.students.map(s => ({ id: s.id })),
      teacher: { id: (_data.teacher as Teacher).id }
    }
    try {
      await axios.post('/api/lessons', data)
      toast.success('تم إضافة الدرس بنجاح.')
      router.push('/lessons')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>إضافة درس</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>إضافة درس</h1>
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
              isMulti
              value={selectedStudents}
              onChange={studentsOnChange}
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.students?.message}
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
  const teachers = await prisma.teacher.findMany()
  const students = await prisma.student.findMany()
  return {
    props: {
      teachers,
      students
    }
  }
}

export default CreateLesson
