import { ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MdOutlineExpandMore } from 'react-icons/md'

type Props = {
  icon: any
  title: string
  active?: boolean
  dropdown?: boolean
} & ComponentPropsWithoutRef<'a'>

const SidebarButton = ({
  icon: Icon,
  title,
  active,
  dropdown = false,
  className,
  href,
  ...rest
}: Props) => {
  const { pathname } = useRouter()
  if (active === undefined) active = href ? pathname === href : false

  const Component = (
    <a
      className={`cursor-pointer whitespace-nowrap hover:bg-black/25 rounded-lg transition-colors flex items-center py-4 ${
        active ? 'bg-black/25' : 'bg-black/10'
      } ${className || ''}`}
      {...rest}
    >
      <Icon className='flex-shrink-0 w-[calc(80px-1.5rem)] ml-3' size={20} />
      {title}
      {dropdown && <MdOutlineExpandMore size={22} className='mr-auto ml-3' />}
    </a>
  )
  return href ? <Link href={href}>{Component}</Link> : Component
}

SidebarButton

export default SidebarButton
