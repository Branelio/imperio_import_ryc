'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Algo salio mal</h2>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--text-inverse)',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
