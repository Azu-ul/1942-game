import React from 'react'

function Balas({ bala }) {
  const esBalaJugador = bala.vy < 0
  
  if (esBalaJugador) {
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
    // Balas enemigas se mantienen como círculos rojos
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