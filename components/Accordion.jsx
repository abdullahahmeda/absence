import { useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

export default function Accordion ({
  header,
  children,
  initiallyOpen = false
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  const toggle = () => setIsOpen(isOpen => !isOpen)

  return (
    <div className='bg-white mb-2 rounded-lg overflow-hidden'>
      <div className='bg-gray-300 px-2 py-4'>
        <button className='block' onClick={toggle}>
          {isOpen ? (
            <MdKeyboardArrowUp className='inline-block' />
          ) : (
            <MdKeyboardArrowDown className='inline-block' />
          )}{' '}
          {header}
        </button>
      </div>
      {isOpen && <div className='p-4'>{children}</div>}
    </div>
  )
}
