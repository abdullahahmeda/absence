import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import loginSchema from '../validation/loginSchema'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { getCsrfToken, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next'

type FormValues = {
  username: string
  password: string
  customError: string
}

const defaultValues = {
  username: '',
  password: ''
}

type Props = {
  csrfToken: string
}

const Login = ({ csrfToken }: Props) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(loginSchema)
  })

  const onSubmit = (data: any) => {
    signIn('credentials', { redirect: false, ...data })
      .then(res => {
        if (res?.error === 'CredentialsSignin') {
          setError('customError', {
            message: 'اسم المستخدم أو كلمة المرور خاطئة.'
          })
          return
        }
        if (!res?.ok) {
          setError('customError', {
            message: 'حدث خطأ أثناء تسجيل الدخول'
          })
          return
        }
        toast.success('تم تسجيل الدخول بنجاح!')
        router.push('/')
      })
      .catch(error => {
        console.log(error)
        setError('customError', {
          message: 'حدث خطأ أثناء تسجيل الدخول'
        })
      })
  }

  return (
    <>
      <Head>
        <title>تسجيل الدخول</title>
      </Head>
      <div>
        <div className='container'>
          <form
            className='bg-gray-200 max-w-sm mx-auto p-3 rounded-lg mt-10'
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className='text-center font-bold text-2xl mb-2'>
              تسجيل الدخول
            </h1>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            <div className='mb-1'>
              <input
                type='text'
                placeholder='اسم المستخدم'
                className='input w-full'
                {...register('username')}
              />
              <p className='text-red-500 text-sm'>
                {formErrors.username?.message}
              </p>
            </div>
            <div className='mb-2'>
              <input
                type='password'
                placeholder='كلمة المرور'
                className='input w-full'
                {...register('password')}
              />
              <p className='text-red-500 text-sm'>
                {formErrors.password?.message}
              </p>
            </div>
            <p className='text-red-500 text-sm mb-2'>
              {formErrors.customError?.message}
            </p>
            <button className='btn-primary'>تسجيل الدخول</button>
          </form>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const csrfToken = await getCsrfToken(context)
  return {
    props: {
      csrfToken
    }
  }
}

Login.disableLayout = true

export default Login
