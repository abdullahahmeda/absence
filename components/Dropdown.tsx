import { ReactNode } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { MdOutlineExpandMore } from 'react-icons/md'

type Props = {
  title: ReactNode
  children: ReactNode
}

const Dropdown = ({ title, children }: Props) => {
  return (
    <Disclosure>
      <Disclosure.Button className='flex w-full'>{title}</Disclosure.Button>
      <div className='overflow-y-hidden'>
        <Transition
          enter='transition duration-300'
          enterFrom='transform origin-top translate-y-[-100%]'
          enterTo='transform origin-top translate-y-0'
          leave='transition duration-300'
          leaveFrom='transform origin-bottom translate-y-0'
          leaveTo='transform origin-bottom translate-y-[-100%]'
        >
          <Disclosure.Panel>{children}</Disclosure.Panel>
        </Transition>
      </div>
    </Disclosure>
  )
}

export default Dropdown
