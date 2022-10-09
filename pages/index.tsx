import Head from 'next/head'
import prisma from '../lib/prisma'

type Props = {
  studentsCount: number
  teachersCount: number
}

const Home = ({ studentsCount, teachersCount }: Props) => {
  return (
    <>
      <Head>
        <title>الحضور</title>
      </Head>
      <div>عدد الطلاب: {studentsCount}</div>
      <div>{teachersCount}</div>
    </>
  )
}

export async function getServerSideProps () {
  const studentsCount = await prisma.student.count()
  const teachersCount = await prisma.teacher.count()

  return {
    props: {
      studentsCount,
      teachersCount
    }
  }
}

export default Home
