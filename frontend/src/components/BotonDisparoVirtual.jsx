import React, { useState, useRef, useEffect } from 'react'

function BotonDisparoVirtual({ onDisparar, style }) {
  const [presionado, setPresionado] = useState(false)
  const buttonRef = useRef(null)

  const activar = () => {
    setPresionado(true)
    onDisparar(true)
  }

  const desactivar = () => {
    setPresionado(false)
    onDisparar(false)
  }

  useEffect(() => {
    const currentRef = buttonRef.current
    if (!currentRef) return

    // ✅ Manejadores táctiles con passive: false
    const handleTouchStart = (e) => {
      e.preventDefault()
      activar()
    }

    const handleTouchEnd = (e) => {
      e.preventDefault()
      desactivar()
    }

    // ✅ Registrar con passive: false
    currentRef.addEventListener('touchstart', handleTouchStart, { passive: false })
    currentRef.addEventListener('touchend', handleTouchEnd, { passive: false })

    // ✅ Cleanup
    return () => {
      currentRef.removeEventListener('touchstart', handleTouchStart)
      currentRef.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onDisparar])

  return (
    <div
      ref={buttonRef}
      style={{
        position: 'absolute',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: presionado ? 'rgba(255,255,0,0.7)' : 'rgba(255,255,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        color: 'white',
        WebkitTapHighlightColor: 'transparent',
        ...style
      }}
      // ❌ onTouchStart y onTouchEnd REMOVIDOS — ahora se registran en useEffect
      onMouseDown={(e) => {
        e.preventDefault()
        activar()
      }}
      onMouseUp={(e) => {
        e.preventDefault()
        desactivar()
      }}
      onMouseLeave={(e) => {
        if (presionado) {
          desactivar()
        }
      }}
    >
      🔫
    </div>
  )
}

export default BotonDisparoVirtual