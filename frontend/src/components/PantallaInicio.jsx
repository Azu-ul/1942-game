import React, { useState, useEffect } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { apiPuntajes } from '../services/apiPuntajes'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

function PantallaInicio() {
  const { iniciarJuego, mostrarRanking } = useContextoJuego()
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false)
  const [puntajeMaximo, setPuntajeMaximo] = useState(0)

  useEffect(() => {
    const cargarPuntajeMaximo = async () => {
      try {
        const puntajes = await apiPuntajes.obtenerTodos()
        if (puntajes.length > 0) {
          setPuntajeMaximo(puntajes[0].score)
        }
      } catch (e) {
        console.error("No se pudo cargar HI SCORE")
      }
    }
    cargarPuntajeMaximo()
  }, [])

  if (mostrarInstrucciones) {
    return (
      <div className="nes-screen" style={{ 
        width: ANCHO_JUEGO, 
        height: ALTO_JUEGO,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="text-center text-white" style={{ 
          fontSize: '16px', 
          maxWidth: '90%',
          lineHeight: '1.8'
        }}>
          <h4 style={{ marginBottom: '30px', fontSize: '24px', color: '#ffff00' }}>
            CONTROLES
          </h4>
          
          <div style={{ marginBottom: '25px' }}>
            <p style={{ marginBottom: '10px' }}>← → ↑ ↓ : MOVER</p>
            <p style={{ marginBottom: '10px' }}>ESPACIO : DISPARAR</p>
            <p style={{ marginBottom: '10px' }}>ESC : PAUSA</p>
          </div>
          
          <div style={{ 
            borderTop: '2px solid white', 
            paddingTop: '20px',
            marginBottom: '25px'
          }}>
            <h5 style={{ 
              fontSize: '20px', 
              marginBottom: '15px',
              color: '#00ff00'
            }}>
              ENEMIGOS
            </h5>
            <p style={{ marginBottom: '8px' }}>NORMAL: 50 PTS</p>
            <p style={{ marginBottom: '8px' }}>VERDE: 100 PTS</p>
          </div>
          
          <div 
            onClick={() => setMostrarInstrucciones(false)} 
            style={{ 
              cursor: 'pointer', 
              fontSize: '20px',
              padding: '15px 30px',
              border: '2px solid white',
              backgroundColor: 'transparent',
              color: 'white',
              minWidth: '200px',
              textAlign: 'center',
              margin: '0 auto'
            }}
          >
            [ VOLVER ]
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nes-screen" style={{ 
      width: ANCHO_JUEGO, 
      height: ALTO_JUEGO, 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* HI SCORE arriba a la derecha */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        textAlign: 'right',
        color: 'white',
        fontSize: '14px'
      }}>
        <div style={{ marginBottom: '5px' }}>HI SCORE</div>
        <div style={{ color: '#ffff00' }}>
          {puntajeMaximo.toLocaleString().padStart(8, '0')}
        </div>
      </div>

      {/* Título centrado */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: '50px'
      }}>
        <img
          src="/assets/screens/titulo_1942.png"
          alt="1942"
          style={{
            height: '120px',
            maxWidth: '90%',
            imageRendering: 'pixelated'
          }}
        />
      </div>

      {/* Opciones del menú */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '50px'
      }}>
        <div 
          onClick={iniciarJuego} 
          style={{ 
            cursor: 'pointer',
            fontSize: '24px',
            padding: '15px 30px',
            border: '2px solid white',
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'center',
            minWidth: '280px',
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
          1 PLAYER
        </div>
        
        <div 
          onClick={() => setMostrarInstrucciones(true)} 
          style={{ 
            cursor: 'pointer',
            fontSize: '20px',
            padding: '12px 25px',
            border: '2px solid white',
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'center',
            minWidth: '280px',
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
          INSTRUCCIONES
        </div>
        
        <div 
          onClick={mostrarRanking}
          style={{ 
            cursor: 'pointer',
            fontSize: '20px',
            padding: '12px 25px',
            border: '2px solid white',
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'center',
            minWidth: '280px',
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
          RANKING
        </div>
      </div>
    </div>
  )
}

export default PantallaInicio