import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import profileSchema from 'validation/profileSchema'
import { toast } from 'react-hot-toast'
import { unstable_getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'
import { authOptions } from './api/auth/[...nextauth]'
import { useSession } from 'next-auth/react'

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: ''
}

const Profile = () => {
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError
  } = useForm({
    defaultValues,
    resolver: yupResolver(profileSchema)
  })

  const onSubmit = (data: any) => {
    axios
      .post('/api/profile', data)
      .then(() => {
        toast.success('تم حفظ البيانات.')
      })
      .catch(error => {
        if (!error.response) {
          return toast.error('حدث خطأ أثناء حفظ البيانات.')
        }
        // setError('serverSide', { message: error.response.data?.error })
      })
  }

  return (
    <>
      <Head>
        <title>تعديل البيانات</title>
      </Head>
      <div className='bg-gray-100 rounded-lg p-3'>
        <h1 className='text-center font-bold text-3xl'>تعديل البيانات</h1>
        <p className='mb-2'>اسم المستخدم: {session?.user?.username}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className='text-xl mb-1'>تغيير كلمة المرور</h3>
          <div className='mb-2'>
            <label htmlFor='current-password'>كلمة المرور الحالية</label>
            <input
              type='password'
              {...register('currentPassword')}
              id='current-password'
              className='block w-full input'
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.currentPassword?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='new-password'>كلمة المرور الجديدة</label>
            <input
              type='password'
              {...register('newPassword')}
              id='new-password'
              className='block w-full input'
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.newPassword?.message}
            </p>
          </div>
          <div className='mb-2'>
            <label htmlFor='new-password-confirmation'>
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type='password'
              {...register('newPasswordConfirmation')}
              id='new-password-confirmation'
              className='block w-full input'
            />
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.newPasswordConfirmation?.message}
            </p>
          </div>
          <button className='btn-primary'>حفظ</button>
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

  return {
    props: {
      session
    }
  }
}

export default Profile
