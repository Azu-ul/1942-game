import React, { useState } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

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
      width: ANCHO_JUEGO,
      height: ALTO_JUEGO,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div
            onClick={() => setMostrarParejas(false)}
            style={{
              cursor: 'pointer',
              fontSize: '18px',
              padding: '8px 20px',
              border: '2px solid white',
              backgroundColor: !mostrarParejas ? 'white' : 'transparent',
              color: !mostrarParejas ? 'black' : 'white',
              textAlign: 'center',
              minWidth: '120px'
            }}
          >
            1 PLAYER
          </div>
          <div
            onClick={() => setMostrarParejas(true)}
            style={{
              cursor: 'pointer',
              fontSize: '18px',
              padding: '8px 20px',
              border: '2px solid white',
              backgroundColor: mostrarParejas ? 'white' : 'transparent',
              color: mostrarParejas ? 'black' : 'white',
              textAlign: 'center',
              minWidth: '120px'
            }}
          >
            2 PLAYERS
          </div>
        </div>

        <h1 className="text-center text-white" style={{
          marginBottom: '25px',
          fontSize: '24px',
          color: mostrarParejas ? '#ff00ff' : '#ffff00'
        }}>
          {mostrarParejas ? 'COUPLES HIGH SCORES' : 'HIGH SCORES'}
        </h1>

        {cargandoPuntajes ? (
          <div className="text-center text-white" style={{ fontSize: '18px' }}>
            <p>CARGANDO RANKINGS...</p>
          </div>
        ) : errorPuntajes ? (
          <div className="text-center" style={{ color: '#ff0000', fontSize: '18px' }}>
            <p>ERROR AL CARGAR RANKINGS</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: '400px'
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
                      padding: '10px 15px',
                      borderBottom: '2px solid white',
                      color: '#ffff00',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      <span style={{ minWidth: '40px' }}>POS</span>
                      <span style={{ minWidth: '60px' }}>NAME</span>
                      <span style={{ minWidth: '120px', textAlign: 'right' }}>SCORE</span>
                    </div>

                    {/* Lista de scores individuales */}
                    {puntajesAltos.slice(0, 10).map((puntaje, index) => (
                      <div
                        key={puntaje.id || index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '2px 5px',
                          backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: 'white',
                          fontSize: '15px',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <span style={{
                          minWidth: '40px',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'white'
                        }}>
                          #{(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span style={{
                          minWidth: '60px',
                          textAlign: 'center',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#00ff00'
                        }}>
                          {puntaje.initials}
                        </span>
                        <span style={{
                          minWidth: '100px',
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
                  <div className="text-center" style={{
                    color: '#888',
                    fontSize: '18px',
                    padding: '50px 20px'
                  }}>
                    <p>NO HAY SCORES INDIVIDUALES AÚN</p>
                    <p style={{ fontSize: '14px', marginTop: '20px' }}>
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
                      padding: '10px 15px',
                      borderBottom: '2px solid white',
                      color: '#ff00ff',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      <span style={{ minWidth: '30px' }}>POS</span>
                      <span style={{ minWidth: '100px' }}>COUPLE</span>
                      <span style={{ minWidth: '100px', textAlign: 'right' }}>TOTAL</span>
                    </div>

                    {/* Lista de scores de parejas */}
                    {puntajesParejas.slice(0, 10).map((pareja, index) => (
                      <div
                        key={pareja.id || index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '2px 5px',
                          backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: 'white',
                          fontSize: '15px',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <span style={{
                          minWidth: '30px',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'white'
                        }}>
                          #{(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span style={{
                          minWidth: '100px',
                          textAlign: 'center',
                          color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#00ff00'
                        }}>
                          {pareja.player1_initials} & {pareja.player2_initials}
                        </span>
                        <span style={{
                          minWidth: '100px',
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
                  <div className="text-center" style={{
                    color: '#888',
                    fontSize: '18px',
                    padding: '50px 20px'
                  }}>
                    <p>NO HAY SCORES DE PAREJAS AÚN</p>
                    <p style={{ fontSize: '14px', marginTop: '20px' }}>
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={volverAlMenuPrincipal}
          className="nes-btn is-primary"
          style={{
            fontSize: '16px',
            padding: '10px 30px',
            cursor: 'pointer'
          }}
        >
          Volver al Menú
        </button>
      </div>
    </div>
  )
}

export default PantallaRanking