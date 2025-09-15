import React, { useState } from 'react'

function BotonDisparoVirtual({ onDisparar, style }) {
  const [presionado, setPresionado] = useState(false)

  return (
    <div
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
      onTouchStart={(e) => {
        e.preventDefault()
        setPresionado(true)
        onDisparar(true)
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        setPresionado(false)
        onDisparar(false)
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        setPresionado(true)
        onDisparar(true)
      }}
      onMouseUp={(e) => {
        e.preventDefault()
        setPresionado(false)
        onDisparar(false)
      }}
      onMouseLeave={(e) => {
        if (presionado) {
          setPresionado(false)
          onDisparar(false)
        }
      }}
    >
      🔫
    </div>
  )
}

export default BotonDisparoVirtual