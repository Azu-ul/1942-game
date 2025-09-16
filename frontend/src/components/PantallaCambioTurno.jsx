import React from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

function PantallaCambioTurno() {
  const { 
    jugadorActual, 
    puntuacionJ1, 
    puntuacionJ2, 
    vidasJ1, 
    vidasJ2 
  } = useContextoJuego()

  const jugadorAnterior = jugadorActual === 1 ? 2 : 1

  return (
    <div 
      className="nes-screen" 
      style={{ 
        width: ANCHO_JUEGO, 
        height: ALTO_JUEGO, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(45deg, #000, #222, #000)',
        position: 'relative'
      }}
    >
      {/* Efecto de parpadeo */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, transparent 30%, rgba(255,255,0,0.1) 70%)',
          animation: 'pulso 1s ease-in-out infinite alternate'
        }}
      />

      <div 
        style={{
          textAlign: 'center',
          zIndex: 10,
          padding: '40px',
          border: '3px solid #ffff00',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '0',
          minWidth: '400px'
        }}
      >
        <h2 
          style={{ 
            marginBottom: '30px',
            fontSize: '36px',
            color: '#ff0000',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          PLAYER {jugadorAnterior} DOWN!
        </h2>
        
        <div style={{ marginBottom: '30px', fontSize: '18px', color: 'white' }}>
          <p style={{ marginBottom: '15px' }}>
            PLAYER {jugadorAnterior} SCORE: {jugadorAnterior === 1 ? puntuacionJ1.toLocaleString() : puntuacionJ2.toLocaleString()}
          </p>
        </div>

        <h3 
          style={{ 
            marginBottom: '20px',
            fontSize: '28px',
            color: '#00ff00',
            animation: 'parpadeo 0.8s ease-in-out infinite alternate'
          }}
        >
          PLAYER {jugadorActual} TURN!
        </h3>

        <div style={{ fontSize: '16px', color: '#cccccc' }}>
          <p style={{ marginBottom: '10px' }}>
            LIVES: {jugadorActual === 1 ? vidasJ1 : vidasJ2}
          </p>
          <p style={{ marginBottom: '20px' }}>
            CURRENT SCORE: {jugadorActual === 1 ? puntuacionJ1.toLocaleString() : puntuacionJ2.toLocaleString()}
          </p>
        </div>

        <div style={{ 
          fontSize: '14px', 
          color: '#888',
          marginTop: '20px'
        }}>
          Get ready...
        </div>
      </div>

      <style>{`
        @keyframes parpadeo {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        @keyframes pulso {
          0% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}

export default PantallaCambioTurno