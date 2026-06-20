'use client'

import React, { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(onDismiss, 200)
      }, 3500)
      return () => clearTimeout(t)
    }
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3 rounded-lg shadow-xl z-50 text-sm transition-all duration-200 ${
        visible ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'
      }`}
    >
      {message}
    </div>
  )
}
