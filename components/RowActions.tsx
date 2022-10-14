import Link from 'next/link'
import { MdDelete, MdEdit } from 'react-icons/md'

type Props = {
  onDelete: () => void
  editLink: string
}

export default function RowActions ({ editLink, onDelete }: Props) {
  return (
    <div className='flex'>
      <Link href={editLink} passHref>
        <a className='ml-1 flex items-center btn-warning'>
          <MdEdit className='ml-1' size={16} />
          تعديل
        </a>
      </Link>
      <button
        onClick={() => onDelete()}
        className='flex items-center btn-error'
      >
        <MdDelete className='ml-1' size={16} />
        حذف
      </button>
    </div>
  )
}
