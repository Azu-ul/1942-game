// Balas.jsx
import React from 'react'

function Balas({ bala }) {
  // ✅ Usamos el tipo explícito que viene desde MotorJuego
  if (bala.tipo === 'jugador') {
    return (
      <img
        src="/assets/bala2.png"
        alt="Player Bullet"
        className="sprite"
        style={{
          left: bala.x,
          top: bala.y,
          width: '8px',
          height: '16px',
          zIndex: 5,
          position: 'absolute',
          imageRendering: 'pixelated'
        }}
      />
    )
  } else {
    // Balas enemigas: siempre círculos rojos, sin importar dirección
    return (
      <div
        className="position-absolute"
        style={{
          left: bala.x,
          top: bala.y,
          width: '8px',
          height: '8px',
          backgroundColor: '#ff0000',
          borderRadius: '50%',
          zIndex: 5
        }}
      />
    )
  }
}

export default Balas