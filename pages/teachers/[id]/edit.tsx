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
import prisma from 'lib/prisma'
import { Teacher } from '@prisma/client'
import teacherSchema from 'validation/teacherSchema'

type FormValues = {
  name: string
}

type Props = {
  teacher: Teacher
}

const EditTeacher = ({ teacher }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(teacherSchema)
  })

  useEffect(() => {
    reset(teacher)
  }, [])

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.patch(`/api/teachers/${teacher.id}`, data)
      toast.success('تم تعديل الشيخ بنجاح.')
      router.push('/teachers')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>تعديل شيخ</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>تعديل شيخ</h1>
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
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!teacher) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      teacher
    }
  }
}

export default EditTeacher
