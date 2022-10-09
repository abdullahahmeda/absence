import { createContext, useCallback, useContext, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

const ConfirmContext = createContext()

const DEFAULT_OPTIONS = {
  title: 'هل أنت متأكد؟',
  description: '',
  confirmationText: 'موافق',
  cancellationText: 'إلغاء',
  dialogProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
  titleProps: {},
  contentProps: {}
}

const buildOptions = (defaultOptions, options) => {
  const dialogProps = {
    ...(defaultOptions.dialogProps || DEFAULT_OPTIONS.dialogProps),
    ...(options.dialogProps || {})
  }
  const confirmationButtonProps = {
    ...(defaultOptions.confirmationButtonProps ||
      DEFAULT_OPTIONS.confirmationButtonProps),
    ...(options.confirmationButtonProps || {})
  }
  const cancellationButtonProps = {
    ...(defaultOptions.cancellationButtonProps ||
      DEFAULT_OPTIONS.cancellationButtonProps),
    ...(options.cancellationButtonProps || {})
  }
  const titleProps = {
    ...(defaultOptions.titleProps || DEFAULT_OPTIONS.titleProps),
    ...(options.titleProps || {})
  }
  const contentProps = {
    ...(defaultOptions.contentProps || DEFAULT_OPTIONS.contentProps),
    ...(options.contentProps || {})
  }

  return {
    ...DEFAULT_OPTIONS,
    ...defaultOptions,
    ...options,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
    titleProps,
    contentProps
  }
}
export const ConfirmProvider = ({ children, defaultOptions = {} }) => {
  const [options, setOptions] = useState({
    ...DEFAULT_OPTIONS,
    ...defaultOptions
  })
  const [resolveReject, setResolveReject] = useState([])
  const [resolve, reject] = resolveReject

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setOptions(buildOptions(defaultOptions, options))
      setResolveReject([resolve, reject])
    })
  }, [])

  const handleClose = useCallback(() => {
    setResolveReject([])
  }, [])

  const handleCancel = useCallback(() => {
    if (reject) {
      reject()
      handleClose()
    }
  }, [reject, handleClose])

  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve()
      handleClose()
    }
  }, [resolve, handleClose])

  return (
    <>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <ConfirmDialog
        open={resolveReject.length === 2}
        options={options}
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export function useConfirm () {
  return useContext(ConfirmContext)
}
