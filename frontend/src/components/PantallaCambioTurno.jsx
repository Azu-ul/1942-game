import React from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'

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
          padding: '2.5em',
          border: '3px solid #ffff00',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '0',
          minWidth: '80%',
          maxWidth: '90%'
        }}
      >
        <h2 
          style={{ 
            marginBottom: '1.5em',
            fontSize: '2.25em',
            color: '#ff0000',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          PLAYER {jugadorAnterior} DOWN!
        </h2>
        
        <div style={{ 
          marginBottom: '1.5em', 
          fontSize: '1.125em',
          color: 'white' 
        }}>
          <p style={{ marginBottom: '0.8em' }}>
            PLAYER {jugadorAnterior} SCORE: {jugadorAnterior === 1 ? puntuacionJ1.toLocaleString() : puntuacionJ2.toLocaleString()}
          </p>
        </div>

        <h3 
          style={{ 
            marginBottom: '1em',
            fontSize: '1.75em',
            color: '#00ff00',
            animation: 'parpadeo 0.8s ease-in-out infinite alternate'
          }}
        >
          PLAYER {jugadorActual} TURN!
        </h3>

        <div style={{ 
          fontSize: '1em', 
          color: '#cccccc' 
        }}>
          <p style={{ marginBottom: '0.5em' }}>
            LIVES: {jugadorActual === 1 ? vidasJ1 : vidasJ2}
          </p>
          <p style={{ marginBottom: '1em' }}>
            CURRENT SCORE: {jugadorActual === 1 ? puntuacionJ1.toLocaleString() : puntuacionJ2.toLocaleString()}
          </p>
        </div>

        <div style={{ 
          fontSize: '0.875em', 
          color: '#888',
          marginTop: '1em'
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