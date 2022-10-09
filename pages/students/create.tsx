import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import studentSchema from 'validation/studentSchema'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

type FormValues = {
  name: string
}

const CreateStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(studentSchema)
  })

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/api/students', data)
      toast.success('تم إضافة الطالب بنجاح.')
      router.push('/students')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>إضافة طالب</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>إضافة طالب</h1>
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
            إضافة
          </LoadingButton>
        </form>
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
  if (!session) {
    return {
      notFound: true
    }
  }

  return {
    props: {}
  }
}

export default CreateStudent
