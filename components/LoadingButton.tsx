import { ComponentPropsWithoutRef } from 'react'
import { CgSpinner } from 'react-icons/cg'

type Props = {
  isLoading?: boolean
} & ComponentPropsWithoutRef<'button'>

export default function LoadingButton ({
  isLoading = false,
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button disabled={isLoading || disabled} {...rest}>
      {isLoading ? <CgSpinner /> : children}
    </button>
  )
}
