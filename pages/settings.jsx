import { DevTool } from '@hookform/devtools'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { withIronSessionSsr } from 'iron-session/next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { SESSION_CONFIG, SOCKET_EVENTS } from '../constants'
import prisma from '../lib/prisma'
import socket from '../lib/socket'
import settingsSchema from '../validation/settingsSchema'

const defaultValues = {
  noReplyMessage: '',
  textOnlyMessage: '',
  approvedMessage: '',
  rejectedMessage: '',
  underReviewMessage: ''
}

const KEYS_MAP = {
  noReplyMessage: {
    component: 'textarea',
    label: 'الرسالة في حالة عدم وجود رد'
  },
  textOnlyMessage: {
    component: 'textarea',
    label: 'الرد في حالة عدم الرد بنص'
  },
  approvedMessage: {
    component: 'textarea',
    label: 'الرد في حالة قبول مستخدم'
  },
  rejectedMessage: {
    component: 'textarea',
    label: 'الرد في حالة رفض مستخدم'
  },
  underReviewMessage: {
    component: 'textarea',
    label: 'الرد في حالة المستخدم تحت المراجعة'
  }
}

const TelegramBotSettings = ({ settings }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(settingsSchema)
  })

  useEffect(() => {
    reset(
      settings.reduce(
        (obj, val) => ({
          ...obj,
          [val.key]: val.value
        }),
        {}
      )
    )
  }, [])

  const onSubmit = data => {
    axios
      .patch('/api/settings', data)
      .then(() => {
        toast.success('تم حفظ الإعدادات.')
        socket.emit(SOCKET_EVENTS.UPDATE_SETTINGS)
      })
      .catch(() => {
        toast.error('حدث خطأ أثناء حفظ الإعدادات.')
      })
  }

  return (
    <>
      <Head>
        <title>الإعدادات</title>
      </Head>
      <div>
        <div className='bg-gray-100 rounded-lg p-3'>
          <h1 className='text-3xl font-bold mb-2 text-center'>الإعدادات</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {settings.map(setting => {
              const Component = KEYS_MAP[setting.key]?.component
              const props = KEYS_MAP[setting.key]?.props
              return (
                Component && (
                  <div key={setting.key} className='mb-2'>
                    <label htmlFor={setting.key}>
                      {KEYS_MAP[setting.key]?.label}
                    </label>
                    <Component
                      {...props}
                      id={setting.key}
                      className='block w-full rounded-md input'
                      {...register(setting.key)}
                    />
                    <p className='text-red-500 text-sm'>
                      {formErrors[setting.key]?.message}
                    </p>
                  </div>
                )
              )
            })}
            <button className='btn-primary'>حفظ</button>
          </form>
          {/* <DevTool control={control} /> */}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (!req.session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  const settings = await prisma.botSetting.findMany()
  return {
    props: {
      settings
    }
  }
}, SESSION_CONFIG)

export default TelegramBotSettings
