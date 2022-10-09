import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef } from 'react'

export default function ConfirmDialog ({
  open,
  options,
  onCancel,
  onConfirm,
  onClose
}) {
  const {
    title,
    description,
    confirmationText,
    cancellationText,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
    titleProps,
    contentProps
  } = options

  const confirmButtonRef = useRef(null)

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog
        as='div'
        // open={open}
        {...dialogProps}
        onClose={onClose}
        className='relative z-50'
        initialFocus={null}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        </Transition.Child>

        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative bg-white rounded-lg overflow-hidden transform transition-all my-8 max-w-lg w-[30rem] p-4'>
                {title && (
                  <Dialog.Title
                    className='text-2xl font-bold mb-1'
                    {...titleProps}
                  >
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description {...contentProps}>
                    {description}
                  </Dialog.Description>
                )}
                <div className='flex justify-end mt-2'>
                  <button
                    className='px-3 py-2 rounded transition-colors bg-neutral-100 hover:bg-neutral-200 text-black focus:ring focus:ring-neutral-200 focus:ring-opacity-30'
                    {...cancellationButtonProps}
                    onClick={onCancel}
                  >
                    {cancellationText}
                  </button>
                  <button
                    className='mr-1 px-3 py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white focus:ring focus:ring-blue-600 focus:ring-opacity-30'
                    {...confirmationButtonProps}
                    onClick={onConfirm}
                    ref={confirmButtonRef}
                  >
                    {confirmationText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
