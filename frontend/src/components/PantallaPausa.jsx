import React from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

function PantallaPausa() {
  const { reanudarJuego, volverAlMenuPrincipal, puntuacion, vidas } = useContextoJuego()

  return (
    <div className="nes-screen" style={{ 
      width: ANCHO_JUEGO, 
      height: ALTO_JUEGO, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.8)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '3px solid white',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '0',
        minWidth: '300px'
      }}>
        <h2 className="text-white" style={{ 
          marginBottom: '30px',
          fontSize: '32px',
          color: '#ffff00'
        }}>
          PAUSA
        </h2>
        
        <div style={{ marginBottom: '30px', fontSize: '18px' }}>
          <p className="text-white" style={{ marginBottom: '10px' }}>
            SCORE: {puntuacion.toLocaleString().padStart(8, '0')}
          </p>
          <p className="text-white" style={{ marginBottom: '10px' }}>
            LIVES: {vidas}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px', 
          alignItems: 'center' 
        }}>
          <div 
            onClick={reanudarJuego} 
            style={{ 
              cursor: 'pointer', 
              fontSize: '20px',
              padding: '12px 30px',
              border: '2px solid white',
              backgroundColor: 'transparent',
              color: 'white',
              minWidth: '250px',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.color = 'black'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = 'white'
            }}
          >
            [ CONTINUAR ]
          </div>
          
          <div 
            onClick={volverAlMenuPrincipal} 
            style={{ 
              cursor: 'pointer', 
              fontSize: '18px',
              padding: '10px 25px',
              border: '2px solid white',
              backgroundColor: 'transparent',
              color: 'white',
              minWidth: '250px',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.color = 'black'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = 'white'
            }}
          >
            [ SALIR AL MENÚ ]
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#888' 
        }}>
          Presiona ESC para continuar
        </div>
      </div>
    </div>
  )
}

export default PantallaPausa