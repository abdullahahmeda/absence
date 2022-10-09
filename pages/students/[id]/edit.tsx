import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import { isValidId } from 'utils'
import studentSchema from 'validation/studentSchema'
import prisma from 'lib/prisma'
import { Student } from '@prisma/client'

type FormValues = {
  name: string
}

type Props = {
  student: Student
}

const EditStudent = ({ student }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(studentSchema)
  })

  useEffect(() => {
    reset(student)
  }, [])

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.patch(`/api/students/${student.id}`, data)
      toast.success('تم تعديل الطالب بنجاح.')
      router.push('/students')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>تعديل طالب</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>تعديل طالب</h1>
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
          <LoadingButton isLoading={isSubmitting} className='btn-primary'>
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
  const student = await prisma.student.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!student) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      student
    }
  }
}

export default EditStudent
