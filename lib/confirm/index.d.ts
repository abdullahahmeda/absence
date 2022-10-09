import * as React from 'react'

export interface ConfirmOptions {
  title?: React.ReactNode
  titleProps?: any
  description?: React.ReactNode
  contentProps?: any
  confirmationText?: React.ReactNode
  cancellationText?: React.ReactNode
  dialogProps?: any
  confirmationButtonProps?: React.ComponentPropsWithoutRef<'button'>
  cancellationButtonProps?: React.ComponentPropsWithoutRef<'button'>
}

export interface ConfirmProviderProps {
  children: React.ReactNode
  defaultOptions?: ConfirmOptions
}

export const ConfirmProvider: React.ComponentType<ConfirmProviderProps>

export const useConfirm: () => (options?: ConfirmOptions) => Promise<void>
