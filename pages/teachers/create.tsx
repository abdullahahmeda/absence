import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import LoadingButton from 'components/LoadingButton'
import teacherSchema from 'validation/teacherSchema'

type FormValues = {
  name: string
}

const defaultValues = {
  name: ''
}

const CreateTeacher = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(teacherSchema)
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/api/teachers', data)
      toast.success('تم إضافة الشيخ بنجاح.')
      router.push('/teachers')
    } catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما.')
    }
  }

  return (
    <>
      <Head>
        <title>إضافة شيخ</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>إضافة شيخ</h1>
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

export default CreateTeacher
