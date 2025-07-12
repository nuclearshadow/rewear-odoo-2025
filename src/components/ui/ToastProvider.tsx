'use client'

/**
 * USAGE:
 *
 * 1. Wrap your app with <ToastProvider position="bottom-center"> in layout.tsx or root component.
 * 2. Use the hook in any component:
 * 
 *    const { showToast } = useToast()
 *    showToast('Item uploaded successfully', 'success')
 *
 * 3. Optional toast types: 'success' | 'error' | 'info'
 * 4. Optional position values: 
 *    - 'top-left'
 *    - 'top-center'
 *    - 'top-right'
 *    - 'bottom-left'
 *    - 'bottom-center'
 *    - 'bottom-right'
 */

import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

const getPositionClasses = (position: ToastPosition) => {
  const base = 'fixed z-50 transform'
  const map: Record<ToastPosition, string> = {
    'top-left': `${base} top-6 left-6`,
    'top-center': `${base} top-6 left-1/2 -translate-x-1/2`,
    'top-right': `${base} top-6 right-6`,
    'bottom-left': `${base} bottom-6 left-6`,
    'bottom-center': `${base} bottom-6 left-1/2 -translate-x-1/2`,
    'bottom-right': `${base} bottom-6 right-6`,
  }
  return map[position]
}

export const ToastProvider = ({
  children,
  position = 'bottom-center',
}: {
  children: React.ReactNode
  position?: ToastPosition
}) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type })
    setVisible(true)

    const timeout = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setToast(null), 300) // allow animation to finish
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const dismissToast = () => {
    setVisible(false)
    setTimeout(() => setToast(null), 300)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className={getPositionClasses(position)}>
          <div
            className={`relative px-4 py-2 text-white rounded shadow-lg flex items-center gap-3 transition-all duration-300
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              ${
                toast.type === 'success'
                  ? 'bg-green-600'
                  : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
              }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={dismissToast}
              className="absolute top-1 right-2 text-white hover:text-gray-200 text-xl leading-none"
              aria-label="Dismiss toast"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}
