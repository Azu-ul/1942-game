import React, { useEffect } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'

function PantallaPausa() {
  const { reanudarJuego, volverAlMenuPrincipal, puntuacion, vidas } = useContextoJuego()

  // Manejar tecla Escape para reanudar
  useEffect(() => {
    const manejarTeclado = (e) => {
      if (e.code === 'Escape') {
        reanudarJuego()
      }
    }
    
    window.addEventListener('keydown', manejarTeclado)
    return () => window.removeEventListener('keydown', manejarTeclado)
  }, [reanudarJuego])

  return (
    <div className="nes-screen" style={{ 
      background: 'rgba(0, 0, 0, 0.8)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2.5em',
        border: '3px solid white',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '0',
        minWidth: '80%',
        maxWidth: '90%'
      }}>
        <h2 style={{ 
          marginBottom: '1.5em',
          color: '#ffff00'
        }}>
          PAUSA
        </h2>
        
        <div style={{ 
          marginBottom: '1.5em',
          fontSize: '1.125em'
        }}>
          <p style={{ marginBottom: '0.5em' }}>
            SCORE: {puntuacion.toLocaleString().padStart(8, '0')}
          </p>
          <p style={{ marginBottom: '0.5em' }}>
            LIVES: {vidas}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1em', 
          alignItems: 'center' 
        }}>
          <button 
            className="interactive-button"
            onClick={reanudarJuego}
            style={{ 
              fontSize: '1.25em',
              minWidth: '15em'
            }}
          >
            [ CONTINUAR ]
          </button>
          
          <button 
            className="interactive-button"
            onClick={volverAlMenuPrincipal}
            style={{ 
              fontSize: '1.125em',
              minWidth: '15em'
            }}
          >
            [ SALIR AL MENÚ ]
          </button>
        </div>

        <div style={{ 
          marginTop: '1.25em', 
          fontSize: '0.75em', 
          color: '#888' 
        }}>
          Presiona ESC para continuar
        </div>
      </div>
    </div>
  )
}

export default PantallaPausa