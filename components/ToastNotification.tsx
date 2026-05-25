'use client'
import { Toaster } from 'react-hot-toast'

export default function ToastNotification() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { background: '#fff', borderRadius: '12px', border: '1px solid #f0eded' },
        success: { iconTheme: { primary: '#c2185b', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ba1a1a', secondary: '#fff' } },
      }}
    />
  )
}