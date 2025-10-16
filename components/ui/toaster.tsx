"use client"

import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <div
            key={id}
            className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full"
            style={{
              backgroundColor: props.variant === 'destructive' ? '#FEE2E2' : '#F0FDF4',
              borderColor: props.variant === 'destructive' ? '#FCA5A5' : '#BBF7D0',
              marginBottom: '8px'
            }}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold" style={{ color: props.variant === 'destructive' ? '#991B1B' : '#166534' }}>{title}</div>}
              {description && (
                <div className="text-sm opacity-90" style={{ color: props.variant === 'destructive' ? '#7F1D1D' : '#14532D' }}>
                  {description}
                </div>
              )}
            </div>
            {action}
          </div>
        )
      })}
    </div>
  )
}
