// PowerUp.jsx
import React, { memo } from 'react'

const PowerUp = memo(({ powerUp, textoFlotante }) => {
  const { x, y, tipo, tiempoVida } = powerUp
  
  // Determinar si el power-up debe parpadear (últimos 2 segundos)
  const debeParpadear = tiempoVida > 8
  
  // Animación de oscilación horizontal
  const offsetX = Math.sin(tiempoVida * 3) * 10
  
  return (
    <>
      {/* Power-up sprite */}
      <div
        style={{
          position: 'absolute',
          left: `${x + offsetX}px`,
          top: `${y}px`,
          width: '32px',
          height: '32px',
          imageRendering: 'pixelated',
          zIndex: 10,
          opacity: debeParpadear && Math.floor(tiempoVida * 10) % 2 === 0 ? 0.3 : 1,
          animation: 'pulso 1s infinite ease-in-out'
        }}
      >
        <img
          src={tipo === 'pow' ? '/assets/power_up.png' : '/assets/botiquin.png'}
          alt={tipo}
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated'
          }}
        />
      </div>
      
      {/* Texto flotante cuando se recoge */}
      {textoFlotante.map((texto, index) => (
        <div
          key={`texto-${index}`}
          style={{
            position: 'absolute',
            left: `${texto.x}px`,
            top: `${texto.y - (1 - texto.opacidad) * 30}px`,
            color: texto.tipo === 'pow' ? 'gold' : '#ff69b4',
            fontSize: '20px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            opacity: texto.opacidad,
            zIndex: 100,
            pointerEvents: 'none',
            transform: 'translateX(-50%)'
          }}
        >
          {texto.tipo === 'pow' ? '+2000' : '❤️+'}
        </div>
      ))}
      
      <style>{`
        @keyframes pulso {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  )
})

export default PowerUp