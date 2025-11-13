import React from 'react'

const success = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#f8f9fa',
      }}
    >
      <div
        className="card text-center p-4"
        style={{
          maxWidth: '640px',
          width: '100%',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div className="card-body">
          <div
            style={{
              width: 96,
              height: 96,
              margin: '0 auto',
              borderRadius: '50%',
              background: '#e9f7ef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              color: '#28a745',
            }}
            aria-hidden
          >
            ✓
          </div>

          <h1 className="mt-3 mb-1">Success</h1>
          <p className="text-muted mb-3">
            We received your order — thank you! We'll be in touch with  shortly.
          </p>
          </div>
          </div>
          </div>
)}

export default success