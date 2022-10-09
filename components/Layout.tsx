import Link from 'next/link'
import { useReducer, useRef, useState } from 'react'
import styled from '@emotion/styled'
import {
  MdHome,
  MdMenu,
  MdOutlineExpandMore,
  MdList,
  MdAdd,
  MdPerson,
  MdStickyNote2
} from 'react-icons/md'
import { FaUserGraduate, FaChalkboardTeacher, FaListAlt } from 'react-icons/fa'
import useOnClickOutside from 'hooks/useOnClickOutside'
import useMediaQuery from '../hooks/useMediaQuery'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useSession, signOut } from 'next-auth/react'
import { CgSpinner } from 'react-icons/cg'
import SidebarButton from './SidebarButton'
import Dropdown from './Dropdown'

const sidebarMiniVariantWidth = 80
const sidebarWidth = 300

const Sidebar = styled('div', {
  shouldForwardProp: (prop: any) => prop !== 'open'
})(({ open }: any) => ({
  overflow: 'hidden',
  transition: 'all .3s',
  width: 0,
  zIndex: 99,
  ...(open && {
    width: sidebarWidth
  }),
  '@media (min-width: 1024px)': {
    width: sidebarMiniVariantWidth,
    ...(open && {
      width: sidebarWidth
    })
  }
}))

const DropdownContent = styled('div', {
  shouldForwardProp: (prop: any) => prop !== 'open'
})(({ open }: any) => ({
  transition: 'transform 0.3s',
  ...(open && {
    transform: 'translateY(0%)'
  })
}))

const LayoutWrapper = styled('div', {
  shouldForwardProp: (prop: any) => prop !== 'open'
})(({ open }: any) => ({
  marginRight: 0,
  transition: 'margin-right .3s',

  '@media (min-width: 1024px)': {
    marginRight: `${sidebarMiniVariantWidth}px`,
    ...(open && {
      marginRight: sidebarWidth
    })
  }
}))

const Overlay = styled('div', {
  shouldForwardProp: (prop: any) => prop !== 'open'
})(({ open }: any) => ({
  display: 'block',
  position: 'fixed',
  left: 0,
  top: 0,
  background: 'rgba(0, 0, 0, .3)',
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity .3s',
  pointerEvents: 'none',

  ...(open && {
    opacity: 1,
    pointerEvents: 'auto'
  }),
  zIndex: 90
}))

export default function Layout ({ children }: any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isStudentsDropdownOpen, toggleStudentsDropdown] = useReducer(
    isOpen => !isOpen,
    false
  )
  const [isTeachersDropdownOpen, toggleTeachersDropdown] = useReducer(
    isOpen => !isOpen,
    false
  )
  const [isSessionsDropdownOpen, toggleSessionsDropdown] = useReducer(
    isOpen => !isOpen,
    false
  )
  const [isLessonsDropdownOpen, toggleLessonsDropdown] = useReducer(
    isOpen => !isOpen,
    false
  )

  const { pathname, push } = useRouter()

  const { data: session, status } = useSession()

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleSidebar = () => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)

  const sidebarRef = useRef(null)

  useOnClickOutside(sidebarRef, () => {
    if (!isDesktop) closeSidebar()
  })

  const logout = () => {
    signOut({ redirect: false })
      .then(() => {
        toast.success('تم تسجيل الخروج.')
        push('/')
      })
      .catch(() => {
        toast.error('حدث خطأ أثناء تسجيل الخروج.')
      })
  }

  return (
    <>
      <Sidebar
        className='fixed right-0 top-0 bottom-0 bg-blue-600 max-w-full text-white'
        open={isSidebarOpen}
        ref={sidebarRef}
      >
        <div>
          <ul className='justify-content-end flex-grow-1 mt-2'>
            <li className='mx-3 mb-2'>
              <SidebarButton
                icon={MdHome}
                title='الرئيسية'
                onClick={closeSidebar}
                href='/'
              />
            </li>
            <li className='mx-3 block mb-2'>
              <button
                className={`flex items-center cursor-pointer w-full py-4 rounded-lg whitespace-nowrap hover:bg-black/25 transition-colors ${
                  pathname.startsWith('/students')
                    ? 'bg-black/25'
                    : 'bg-black/10'
                }`}
                onClick={toggleStudentsDropdown}
              >
                <FaUserGraduate
                  size={20}
                  className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                />
                الطلاب
                <MdOutlineExpandMore
                  size={24}
                  className={`mr-auto ml-3 transition-transform ${isStudentsDropdownOpen &&
                    'rotate-180'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[max-height] ${
                  isStudentsDropdownOpen ? 'max-h-[120px]' : 'max-h-0'
                }`}
              >
                <DropdownContent open={isStudentsDropdownOpen}>
                  <ul className='mt-1'>
                    <li className='mx-1 mb-1'>
                      <Link href='/students' passHref>
                        <a
                          className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                            pathname === '/students'
                              ? 'bg-black/25'
                              : 'bg-black/10'
                          }`}
                          onClick={closeSidebar}
                        >
                          <MdList
                            className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                            size={20}
                          />
                          عرض الكل
                        </a>
                      </Link>
                    </li>
                    {status === 'authenticated' && (
                      <li className='mx-1 mb-1'>
                        <Link href='/students/create' passHref>
                          <a
                            className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                              pathname === '/students/create'
                                ? 'bg-black/25'
                                : 'bg-black/10'
                            }`}
                            onClick={closeSidebar}
                          >
                            <MdAdd
                              className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                              size={20}
                            />
                            إضافة
                          </a>
                        </Link>
                      </li>
                    )}
                  </ul>
                </DropdownContent>
              </div>
            </li>
            <li className='mx-3 block mb-2'>
              <button
                className={`flex items-center cursor-pointer w-full py-4 rounded-lg whitespace-nowrap hover:bg-black/25 transition-colors ${
                  pathname.startsWith('/teachers')
                    ? 'bg-black/25'
                    : 'bg-black/10'
                }`}
                onClick={toggleTeachersDropdown}
              >
                <FaChalkboardTeacher
                  size={24}
                  className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                />
                المشايخ
                <MdOutlineExpandMore
                  size={24}
                  className={`mr-auto ml-3 transition-transform ${isTeachersDropdownOpen &&
                    'rotate-180'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[max-height] ${
                  isTeachersDropdownOpen ? 'max-h-[120px]' : 'max-h-0'
                }`}
              >
                <DropdownContent open={isTeachersDropdownOpen}>
                  <ul className='mt-1'>
                    <li className='mx-1 mb-1'>
                      <Link href='/teachers' passHref>
                        <a
                          className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                            pathname === '/teachers'
                              ? 'bg-black/25'
                              : 'bg-black/10'
                          }`}
                          onClick={closeSidebar}
                        >
                          {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                          <MdList
                            className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                            size={20}
                          />
                          عرض الكل
                        </a>
                      </Link>
                    </li>
                    {status === 'authenticated' && (
                      <li className='mx-1 mb-1'>
                        <Link href='/teachers/create' passHref>
                          <a
                            className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                              pathname === '/teachers/create'
                                ? 'bg-black/25'
                                : 'bg-black/10'
                            }`}
                            onClick={closeSidebar}
                          >
                            {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                            <MdAdd
                              className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                              size={20}
                            />
                            إضافة
                          </a>
                        </Link>
                      </li>
                    )}
                  </ul>
                </DropdownContent>
              </div>
            </li>
            <li className='mx-3 block mb-2'>
              <button
                className={`flex items-center cursor-pointer w-full py-4 rounded-lg whitespace-nowrap hover:bg-black/25 transition-colors ${
                  pathname.startsWith('/sessions')
                    ? 'bg-black/25'
                    : 'bg-black/10'
                }`}
                onClick={toggleSessionsDropdown}
              >
                <FaListAlt
                  size={24}
                  className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                />
                الجلسات
                <MdOutlineExpandMore
                  size={24}
                  className={`mr-auto ml-3 transition-transform ${isSessionsDropdownOpen &&
                    'rotate-180'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[max-height] ${
                  isSessionsDropdownOpen ? 'max-h-[120px]' : 'max-h-0'
                }`}
              >
                <DropdownContent open={isSessionsDropdownOpen}>
                  <ul className='mt-1'>
                    <li className='mx-1 mb-1'>
                      <Link href='/sessions' passHref>
                        <a
                          className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                            pathname === '/sessions'
                              ? 'bg-black/25'
                              : 'bg-black/10'
                          }`}
                          onClick={closeSidebar}
                        >
                          {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                          <MdList
                            className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                            size={20}
                          />
                          عرض الكل
                        </a>
                      </Link>
                    </li>
                    {status === 'authenticated' && (
                      <li className='mx-1 mb-1'>
                        <Link href='/sessions/create' passHref>
                          <a
                            className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                              pathname === '/sessions/create'
                                ? 'bg-black/25'
                                : 'bg-black/10'
                            }`}
                            onClick={closeSidebar}
                          >
                            {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                            <MdAdd
                              className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                              size={20}
                            />
                            إضافة
                          </a>
                        </Link>
                      </li>
                    )}
                  </ul>
                </DropdownContent>
              </div>
            </li>
            <li className='mx-3 block mb-2'>
              <button
                className={`flex items-center cursor-pointer w-full py-4 rounded-lg whitespace-nowrap hover:bg-black/25 transition-colors ${
                  pathname.startsWith('/lessons')
                    ? 'bg-black/25'
                    : 'bg-black/10'
                }`}
                onClick={toggleLessonsDropdown}
              >
                <MdStickyNote2
                  size={24}
                  className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                />
                الدروس
                <MdOutlineExpandMore
                  size={24}
                  className={`mr-auto ml-3 transition-transform ${isLessonsDropdownOpen &&
                    'rotate-180'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[max-height] ${
                  isLessonsDropdownOpen ? 'max-h-[120px]' : 'max-h-0'
                }`}
              >
                <DropdownContent open={isLessonsDropdownOpen}>
                  <ul className='mt-1'>
                    <li className='mx-1 mb-1'>
                      <Link href='/lessons' passHref>
                        <a
                          className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                            pathname === '/lessons'
                              ? 'bg-black/25'
                              : 'bg-black/10'
                          }`}
                          onClick={closeSidebar}
                        >
                          {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                          <MdList
                            className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                            size={20}
                          />
                          عرض الكل
                        </a>
                      </Link>
                    </li>
                    {status === 'authenticated' && (
                      <li className='mx-1 mb-1'>
                        <Link href='/lessons/create' passHref>
                          <a
                            className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                              pathname === '/lessons/create'
                                ? 'bg-black/25'
                                : 'bg-black/10'
                            }`}
                            onClick={closeSidebar}
                          >
                            {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                            <MdAdd
                              className='flex-shrink-0 w-[calc(80px-2rem)] ml-6'
                              size={20}
                            />
                            إضافة
                          </a>
                        </Link>
                      </li>
                    )}
                  </ul>
                </DropdownContent>
              </div>
            </li>
            {/* <li className='mx-3 mb-2'>
              <Link href='/users' passHref>
                <a
                  className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                    pathname === '/users' ? 'bg-black/25' : 'bg-black/10'
                  }`}
                  onClick={closeSidebar}
                >
                  <MdPeople
                    className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                    size={24}
                  />
                  المستخدمون
                </a>
              </Link>
            </li>
            <li className='mx-3 mb-2'>
              <Link href='/settings' passHref>
                <a
                  className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                    pathname === '/settings' ? 'bg-black/25' : 'bg-black/10'
                  }`}
                  onClick={closeSidebar}
                >
                  <MdSettings
                    className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                    size={24}
                  />
                  الإعدادات
                </a>
              </Link>
            </li> */}
            {status === 'authenticated' && (
              <li className='mx-3 mb-2'>
                <Link href='/profile' passHref>
                  <a
                    className={`whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
                      pathname === '/profile' ? 'bg-black/25' : 'bg-black/10'
                    }`}
                    onClick={closeSidebar}
                  >
                    {/* IMPORTANT! Make sure to change class w-[80px] to whatever sidebarMiniVariantWidth value is */}
                    <MdPerson
                      className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3'
                      size={24}
                    />
                    تعديل البيانات
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </Sidebar>
      {!isDesktop && <Overlay open={isSidebarOpen} />}
      <LayoutWrapper open={isSidebarOpen}>
        <nav className='bg-blue-500 py-3 mx-3 lg:mx-5 mt-2 rounded-md text-white'>
          <div className='px-3'>
            <div className='flex items-center'>
              <button
                onClick={toggleSidebar}
                className={`ml-4 p-2 transition-colors hover:bg-black/10 rounded ${
                  isSidebarOpen ? 'bg-black/25' : ''
                }`}
              >
                <MdMenu size={24} />
              </button>
              <h1 className='text-xl'>لوحة التحكم</h1>
              {status === 'loading' && (
                <CgSpinner className='mr-auto animate-spin ml-10' size={24} />
              )}

              {status === 'authenticated' && (
                <button className='mr-auto link' onClick={logout}>
                  تسجيل الخروج
                </button>
              )}
              {status === 'unauthenticated' && (
                <Link href='/login'>
                  <a className='mr-auto link'>تسجيل الدخول</a>
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main className='lg:px-5 px-3 mt-3'>{children}</main>
      </LayoutWrapper>
    </>
  )
}
