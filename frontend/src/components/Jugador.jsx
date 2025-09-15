import React from 'react'

function Jugador({ jugador }) {
  return (
    <img
      src="/assets/avion_recto.png"
      alt="Player"
      className="sprite"
      style={{
        left: jugador.x,
        top: jugador.y,
        width: '32px',
        height: '32px',
        zIndex: 10,
        position: 'absolute',
        imageRendering: 'pixelated'
      }}
    />
  )
}

export default Jugador