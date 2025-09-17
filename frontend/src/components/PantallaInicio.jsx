import React, { useState, useEffect } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { apiPuntajes } from '../services/apiPuntajes'

function PantallaInicio() {
  const { iniciarJuego, mostrarRanking } = useContextoJuego()
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false)
  const [puntajeMaximo, setPuntajeMaximo] = useState(0)
  const [puntajeMaximoPareja, setPuntajeMaximoPareja] = useState(0)

  useEffect(() => {
    const cargarPuntajesMaximos = async () => {
      try {
        // Cargar puntaje máximo individual
        const puntajes = await apiPuntajes.obtenerTodos()
        if (puntajes.length > 0) {
          setPuntajeMaximo(puntajes[0].score)
        }

        // Cargar puntaje máximo de parejas
        const puntajesParejas = await apiPuntajes.obtenerParejas()
        if (puntajesParejas.length > 0) {
          setPuntajeMaximoPareja(puntajesParejas[0].total_score)
        }
      } catch (e) {
        console.error("No se pudo cargar HI SCORES")
      }
    }
    cargarPuntajesMaximos()
  }, [])

  if (mostrarInstrucciones) {
    return (
      <div className="nes-screen">
        <div style={{ 
          textAlign: 'center',
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '1em'
        }}>
          <h4 style={{ 
            marginBottom: '1.5em', 
            color: '#ffff00' 
          }}>
            CONTROLES
          </h4>
          
          <div style={{ marginBottom: '1.5em' }}>
            <p style={{ marginBottom: '0.5em' }}>← ↑ → ↓ : MOVER</p>
            <p style={{ marginBottom: '0.5em' }}>ESPACIO : DISPARAR</p>
            <p style={{ marginBottom: '0.5em' }}>ESC : PAUSA</p>
          </div>

          <div style={{ 
            borderTop: '2px solid white', 
            paddingTop: '1em',
            marginBottom: '1.5em',
            width: '100%'
          }}>
            <h5 style={{ 
              marginBottom: '1em',
              color: '#00ff00'
            }}>
              MODO 2 JUGADORES
            </h5>
            <p style={{ marginBottom: '0.5em' }}>Los jugadores se turnan cuando uno pierde todas sus vidas</p>
            <p style={{ marginBottom: '0.5em' }}>El juego termina cuando ambos jugadores se quedan sin vidas</p>
            <p style={{ marginBottom: '0.5em' }}>Se guarda el puntaje combinado de la pareja</p>
          </div>
          
          <div style={{ 
            borderTop: '2px solid white', 
            paddingTop: '1em',
            marginBottom: '1.5em',
            width: '100%'
          }}>
            <h5 style={{ 
              marginBottom: '1em',
              color: '#00ff00'
            }}>
              ENEMIGOS
            </h5>
            <p style={{ marginBottom: '0.5em' }}>NORMAL: 50 PTS</p>
            <p style={{ marginBottom: '0.5em' }}>VERDE: 100 PTS</p>
          </div>
          
          <button 
            className="interactive-button"
            onClick={() => setMostrarInstrucciones(false)}
            style={{ 
              marginTop: '1em'
            }}
          >
            [ VOLVER ]
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="nes-screen">
      {/* HI SCORES arriba a la derecha */}
      <div style={{
        position: 'absolute',
        top: '1em',
        right: '1em',
        textAlign: 'right',
        fontSize: '0.75em'
      }}>
        <div style={{ marginBottom: '0.8em' }}>
          <div style={{ marginBottom: '0.3em' }}>1P HI SCORE</div>
          <div style={{ color: '#ffff00' }}>
            {puntajeMaximo.toLocaleString().padStart(8, '0')}
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '0.3em' }}>2P HI SCORE</div>
          <div style={{ color: '#00ff00' }}>
            {puntajeMaximoPareja.toLocaleString().padStart(8, '0')}
          </div>
        </div>
      </div>

      {/* Título centrado */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: '3em'
      }}>
        <img
          src="/assets/screens/titulo_1942.png"
          alt="1942"
          style={{
            height: '7.5em',
            maxWidth: '90%',
            imageRendering: 'pixelated'
          }}
        />
      </div>

      {/* Opciones del menú */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        alignItems: 'center',
        width: '100%',
        maxWidth: '90%',
        marginBottom: '2em'
      }}>
        <button 
          className="interactive-button"
          onClick={() => iniciarJuego('1P')}
          style={{ fontSize: '1.5em' }}
        >
          1 PLAYER
        </button>

        <button 
          className="interactive-button"
          onClick={() => iniciarJuego('2P')}
          style={{ fontSize: '1.5em' }}
        >
          2 PLAYERS
        </button>
        
        <button 
          className="interactive-button"
          onClick={() => setMostrarInstrucciones(true)}
          style={{ fontSize: '1.25em' }}
        >
          INSTRUCCIONES
        </button>
        
        <button 
          className="interactive-button"
          onClick={mostrarRanking}
          style={{ fontSize: '1.25em' }}
        >
          RANKING
        </button>
      </div>
    </div>
  )
}

export default PantallaInicio