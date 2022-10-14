import Head from 'next/head'
import Link from 'next/link'
import { MdErrorOutline } from 'react-icons/md'

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 | هذه الصفحة غير موجودة</title>
      </Head>
      <div className='p-3 bg-red-500 max-w-md mx-auto text-center rounded-md'>
        <p className='flex items-center text-gray-50 justify-center'>
          <MdErrorOutline size={22} className='ml-1' />
          404 | هذه الصفحة غير موجودة
        </p>
        <Link href='/'>
          <a className='btn-link inline-block text-white mt-2'>
            الرجوع للصفحة الرئيسية
          </a>
        </Link>
      </div>
    </>
  )
}

export default NotFound
