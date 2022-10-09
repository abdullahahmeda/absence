import '../styles/globals.css'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'
import { ConfirmProvider } from '../lib/confirm'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { setDefaultOptions } from 'date-fns'
import ar from 'date-fns/locale/ar'
import { SessionProvider } from 'next-auth/react'

setDefaultOptions({
  locale: ar
})

registerLocale('ar', ar)
setDefaultLocale('ar')

export default function App ({
  Component,
  pageProps: { session, ...pageProps }
}: any) {
  return (
    <SessionProvider session={session}>
      <ConfirmProvider>
        {Component.disableLayout ? (
          <>
            <Component {...pageProps} />
            <Toaster
              toastOptions={{
                position: 'bottom-center',
                duration: 4000
              }}
            />
          </>
        ) : (
          <>
            <Layout>
              <Component {...pageProps} />
              <Toaster
                toastOptions={{
                  position: 'bottom-center',
                  duration: 4000
                }}
              />
            </Layout>
          </>
        )}
      </ConfirmProvider>
    </SessionProvider>
  )
}
