import React, { useState } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'

function PantallaRanking() {
  const {
    volverAlMenuPrincipal,
    puntajesAltos,
    puntajesParejas,
    cargandoPuntajes,
    errorPuntajes
  } = useContextoJuego()

  const [mostrarParejas, setMostrarParejas] = useState(false)

  return (
    <div className="nes-screen" style={{
      padding: '1em',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1em',
          marginBottom: '1em'
        }}>
          <button
            className="interactive-button"
            onClick={() => setMostrarParejas(false)}
            style={{
              fontSize: '1.125em',
              backgroundColor: !mostrarParejas ? 'white' : 'transparent',
              color: !mostrarParejas ? 'black' : 'white',
              minWidth: '8em'
            }}
          >
            1 PLAYER
          </button>
          <button
            className="interactive-button"
            onClick={() => setMostrarParejas(true)}
            style={{
              fontSize: '1.125em',
              backgroundColor: mostrarParejas ? 'white' : 'transparent',
              color: mostrarParejas ? 'black' : 'white',
              minWidth: '8em'
            }}
          >
            2 PLAYERS
          </button>
        </div>

        <h1 style={{
          textAlign: 'center',
          marginBottom: '1.5em',
          fontSize: '1.5em',
          color: mostrarParejas ? '#ff00ff' : '#ffff00'
        }}>
          {mostrarParejas ? 'COUPLES HIGH SCORES' : 'HIGH SCORES'}
        </h1>

        {cargandoPuntajes ? (
          <div style={{ 
            textAlign: 'center',
            fontSize: '1.125em',
            padding: '2em'
          }}>
            <p>CARGANDO RANKINGS...</p>
          </div>
        ) : errorPuntajes ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#ff0000', 
            fontSize: '1.125em',
            padding: '2em'
          }}>
            <p>ERROR AL CARGAR RANKINGS</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
            minHeight: '20em',
            maxHeight: '25em',
            overflowY: 'auto'
          }}>
            {!mostrarParejas ? (
              // Rankings individuales
              <>
                {puntajesAltos.length > 0 ? (
                  <>
                    {/* Header del ranking individual */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5em 0.8em',
                      borderBottom: '2px solid white',
                      color: '#ffff00',
                      fontSize: '1em',
                      fontWeight: 'bold'
                    }}>
                      <span style={{ minWidth: '2.5em' }}>POS</span>
                      <span style={{ minWidth: '4em' }}>NAME</span>
                      <span style={{ minWidth: '7em', textAlign: 'right' }}>SCORE</span>
                    </div>

                    {/* Lista de scores individuales */}
                    {puntajesAltos.slice(0, 10).map((puntaje, index) => (
                      <div
                        key={puntaje.id || index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.2em 0.3em',
                          backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: 'white',
                          fontSize: '0.9em',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <span style={{
                          minWidth: '2.5em',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'white'
                        }}>
                          #{(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span style={{
                          minWidth: '4em',
                          textAlign: 'center',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#00ff00'
                        }}>
                          {puntaje.initials}
                        </span>
                        <span style={{
                          minWidth: '7em',
                          textAlign: 'right',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'white'
                        }}>
                          {puntaje.score.toLocaleString().padStart(8, '0')}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '1.125em',
                    padding: '3em 1em'
                  }}>
                    <p>NO HAY SCORES INDIVIDUALES AÚN</p>
                    <p style={{ fontSize: '0.875em', marginTop: '1em' }}>
                      ¡SÉ EL PRIMERO EN APARECER AQUÍ!
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Rankings de parejas
              <>
                {puntajesParejas.length > 0 ? (
                  <>
                    {/* Header del ranking de parejas */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5em 0.8em',
                      borderBottom: '2px solid white',
                      color: '#ff00ff',
                      fontSize: '0.875em',
                      fontWeight: 'bold'
                    }}>
                      <span style={{ minWidth: '2em' }}>POS</span>
                      <span style={{ minWidth: '6em' }}>COUPLE</span>
                      <span style={{ minWidth: '6em', textAlign: 'right' }}>TOTAL</span>
                    </div>

                    {/* Lista de scores de parejas */}
                    {puntajesParejas.slice(0, 10).map((pareja, index) => (
                      <div
                        key={pareja.id || index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.2em 0.3em',
                          backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: 'white',
                          fontSize: '0.9em',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <span style={{
                          minWidth: '2em',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'white'
                        }}>
                          #{(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span style={{
                          minWidth: '6em',
                          textAlign: 'center',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#00ff00',
                          fontSize: '0.8em'
                        }}>
                          {pareja.player1_initials} & {pareja.player2_initials}
                        </span>
                        <span style={{
                          minWidth: '6em',
                          textAlign: 'right',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'white'
                        }}>
                          {pareja.total_score.toLocaleString().padStart(8, '0')}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '1.125em',
                    padding: '3em 1em'
                  }}>
                    <p>NO HAY SCORES DE PAREJAS AÚN</p>
                    <p style={{ fontSize: '0.875em', marginTop: '1em' }}>
                      ¡JUEGA EN MODO 2 JUGADORES Y APARECE AQUÍ!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Botón para volver al menú principal */}
      <div style={{ textAlign: 'center', marginTop: '1em' }}>
        <button
          className="interactive-button"
          onClick={volverAlMenuPrincipal}
          style={{
            fontSize: '1em',
            padding: '0.6em 1.8em'
          }}
        >
          Volver al Menú
        </button>
      </div>
    </div>
  )
}

export default PantallaRanking