'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('error loading dynamically imported module')
    ) {
      window.location.reload()
    }
  }, [error])

  return (
    <html>
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: '#fff',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1c1814' }}>
          Something went wrong
        </h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.75rem 2rem',
            background: '#1c1814',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
