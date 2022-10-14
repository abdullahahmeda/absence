import Head from 'next/head'
import { CircularProgressbar } from 'react-circular-progressbar'
import prisma from '../lib/prisma'

type Props = {
  studentsCount: number
  teachersCount: number
  lessonsCount: number
  presencePercentage: number
}

const Home = ({
  studentsCount,
  teachersCount,
  lessonsCount,
  presencePercentage
}: Props) => {
  return (
    <>
      <Head>
        <title>الحضور</title>
      </Head>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
        <div className='bg-gray-200 text-center rounded-lg p-3'>
          <h3 className='text-2xl'>عدد الشيوخ</h3>
          <p className='text-xl'>{teachersCount}</p>
        </div>
        <div className='bg-gray-200 text-center rounded-lg p-3'>
          <h3 className='text-2xl'>عدد الطلاب</h3>
          <p className='text-xl'>{studentsCount}</p>
        </div>
        <div className='bg-gray-200 text-center rounded-lg p-3'>
          <h3 className='text-2xl'>عدد الدروس</h3>
          <p className='text-xl'>{lessonsCount}</p>
        </div>
        <div className='bg-gray-200 text-center rounded-lg p-3'>
          <h3 className='text-2xl mb-2'>نسبة الحضور الإجمالية</h3>
          <CircularProgressbar
            text={`${presencePercentage.toFixed(1)}%`}
            value={presencePercentage}
            className='w-32 h-32'
          />
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps () {
  const studentsCount = await prisma.student.count()
  const teachersCount = await prisma.teacher.count()
  const lessonsCount = await prisma.lesson.count()

  const presentSessionsStudents = await prisma.sessionStudents.count({
    where: { present: true }
  })
  const allSessionsStudents = await prisma.sessionStudents.count()
  const presencePercentage =
    (presentSessionsStudents / allSessionsStudents) * 100

  return {
    props: {
      studentsCount,
      teachersCount,
      lessonsCount,
      presencePercentage
    }
  }
}

export default Home
