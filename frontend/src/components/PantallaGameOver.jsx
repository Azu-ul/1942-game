import React, { useState } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'

function PantallaGameOver({
  onGuardarPuntaje,
  onGuardarPuntajePareja,
  rankingJ1,
  rankingJ2,
  rankingPareja
}) {
  const {
    modoJuego,
    puntuacionJ1,
    puntuacionJ2,
    puntuacionTotal,
    iniciarJuego,
    volverAlMenuPrincipal,
  } = useContextoJuego()

  // Estados para formularios
  const [inicialesJ1, setInicialesJ1] = useState('')
  const [inicialesJ2, setInicialesJ2] = useState('')
  const [puntajeGuardado, setPuntajeGuardado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // Estados para controlar qué guardar
  const [guardandoIndividual, setGuardandoIndividual] = useState(false)
  const [guardandoPareja, setGuardandoPareja] = useState(false)

  // Verificar si hay nuevos records
  const j1EsRecord = rankingJ1 && rankingJ1 > 0 && rankingJ1 <= 10
  const j2EsRecord = rankingJ2 && rankingJ2 > 0 && rankingJ2 <= 10
  const parejaEsRecord = rankingPareja && rankingPareja > 0 && rankingPareja <= 10

  // Función para filtrar solo letras
  const soloLetras = (str) => str.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()

  const manejarGuardarJ1 = async () => {
    if (inicialesJ1.length === 3) {
      setGuardandoIndividual(true)
      try {
        await onGuardarPuntaje(inicialesJ1, puntuacionJ1)
        setGuardandoIndividual(false)
        verificarCompletado()
      } catch (error) {
        console.error('Error saving P1 score:', error)
        setGuardandoIndividual(false)
      }
    }
  }

  const manejarGuardarJ2 = async () => {
    if (inicialesJ2.length === 3) {
      setGuardandoIndividual(true)
      try {
        await onGuardarPuntaje(inicialesJ2, puntuacionJ2)
        setGuardandoIndividual(false)
        verificarCompletado()
      } catch (error) {
        console.error('Error saving P2 score:', error)
        setGuardandoIndividual(false)
      }
    }
  }

  const manejarGuardarPareja = async () => {
    if (inicialesJ1.length === 3 && inicialesJ2.length === 3) {
      setGuardandoPareja(true)
      try {
        await onGuardarPuntajePareja(inicialesJ1, inicialesJ2)
        setGuardandoPareja(false)
        setPuntajeGuardado(true)
      } catch (error) {
        console.error('Error saving couple score:', error)
        setGuardandoPareja(false)
      }
    }
  }

  const verificarCompletado = () => {
    if (modoJuego === '1P') {
      setPuntajeGuardado(true)
    }
  }

  const manejarKeyDown = (e, callback) => {
    if (e.key === 'Enter') {
      callback()
    }
  }

  if (modoJuego === '1P') {
    return (
      <div className="nes-screen" style={{
        padding: '1em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          textAlign: 'center',
          fontSize: '1.5em',
          width: '100%',
          maxWidth: '90%'
        }}>
          <h1 style={{ 
            marginBottom: '1em', 
            color: '#ff0000',
            fontSize: '1.6em' 
          }}>
            GAME OVER
          </h1>
          <h2 style={{ marginBottom: '1.5em' }}>
            SCORE: {puntuacionJ1.toLocaleString().padStart(8, '0')}
          </h2>

          {j1EsRecord && !puntajeGuardado && (
            <div style={{ marginBottom: '2em' }}>
              <h4 style={{ 
                color: '#ffff00', 
                marginBottom: '1em',
                fontSize: '1.2em'
              }}>
                ¡NUEVO HIGH SCORE!
              </h4>
              <p style={{ 
                fontSize: '1em', 
                marginBottom: '1em' 
              }}>
                POSICION #{rankingJ1} - INGRESA TUS INICIALES:
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1em',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  style={{
                    width: '5em',
                    height: '2.5em',
                    fontSize: '1.2em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    backgroundColor: 'black',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: '0'
                  }}
                  maxLength={3}
                  value={inicialesJ1}
                  onChange={(e) => setInicialesJ1(soloLetras(e.target.value))}
                  onKeyDown={(e) => manejarKeyDown(e, manejarGuardarJ1)}
                  autoFocus
                  disabled={guardandoIndividual}
                  placeholder="ABC"
                />
                <button
                  className="interactive-button"
                  style={{
                    backgroundColor: inicialesJ1.length === 3 ? 'white' : '#666',
                    color: inicialesJ1.length === 3 ? 'black' : '#ccc',
                    cursor: inicialesJ1.length === 3 && !guardandoIndividual ? 'pointer' : 'not-allowed',
                    fontSize: '1em',
                    minWidth: '8em'
                  }}
                  onClick={manejarGuardarJ1}
                  disabled={inicialesJ1.length !== 3 || guardandoIndividual}
                >
                  {guardandoIndividual ? 'GUARDANDO...' : 'GUARDAR'}
                </button>
              </div>
            </div>
          )}

          {(puntajeGuardado || !j1EsRecord) && (
            <div>
              {puntajeGuardado && (
                <div style={{ marginBottom: '1.5em' }}>
                  <h5 style={{ 
                    color: '#00ff00', 
                    fontSize: '1.125em' 
                  }}>
                    ¡SCORE GUARDADO, {inicialesJ1}!
                  </h5>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1em', 
                alignItems: 'center' 
              }}>
                <button
                  className="interactive-button"
                  onClick={() => iniciarJuego('1P')}
                  style={{
                    fontSize: '1.25em',
                    minWidth: '12em'
                  }}
                >
                  [ JUGAR DE NUEVO ]
                </button>
                <button
                  className="interactive-button"
                  onClick={volverAlMenuPrincipal}
                  style={{
                    fontSize: '1.25em',
                    minWidth: '12em'
                  }}
                >
                  [ MENÚ PRINCIPAL ]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Modo 2P
  return (
    <div className="nes-screen" style={{
      padding: '0.8em',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        textAlign: 'center',
        fontSize: '1.25em',
        width: '100%',
        maxWidth: '95%'
      }}>
        <h1 style={{ 
          marginBottom: '1em', 
          color: '#ff0000',
          fontSize: '1.6em'
        }}>
          GAME OVER
        </h1>

        <div style={{ 
          marginBottom: '1.5em', 
          fontSize: '1.125em' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5em',
            flexWrap: 'wrap',
            gap: '0.5em'
          }}>
            <span style={{ color: '#00ff00' }}>P1: {puntuacionJ1.toLocaleString()}</span>
            <span style={{ color: '#ffff00' }}>P2: {puntuacionJ2.toLocaleString()}</span>
          </div>
          <div style={{ 
            fontSize: '1.375em', 
            color: '#ffffff' 
          }}>
            TOTAL: {puntuacionTotal.toLocaleString()}
          </div>
        </div>

        {/* Records individuales */}
        {(j1EsRecord || j2EsRecord) && !puntajeGuardado && (
          <div style={{ 
            marginBottom: '1.5em', 
            fontSize: '0.875em' 
          }}>
            <h4 style={{ 
              color: '#ffff00', 
              marginBottom: '1em',
              fontSize: '1.2em' 
            }}>
              ¡NUEVOS RECORDS INDIVIDUALES!
            </h4>

            <div style={{ 
              display: 'flex', 
              gap: '1em', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              {j1EsRecord && (
                <div style={{ textAlign: 'center', minWidth: '8em' }}>
                  <p style={{ 
                    marginBottom: '0.5em', 
                    color: '#00ff00',
                    fontSize: '0.9em'
                  }}>
                    P1 - POS #{rankingJ1}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5em', 
                    alignItems: 'center' 
                  }}>
                    <input
                      type="text"
                      style={{
                        width: '4em',
                        height: '2em',
                        fontSize: '1em',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        backgroundColor: 'black',
                        color: '#00ff00',
                        border: '2px solid #00ff00',
                        borderRadius: '0'
                      }}
                      maxLength={3}
                      value={inicialesJ1}
                      onChange={(e) => setInicialesJ1(soloLetras(e.target.value))}
                      placeholder="ABC"
                      disabled={guardandoIndividual}
                    />
                    <button
                      className="interactive-button"
                      style={{
                        backgroundColor: inicialesJ1.length === 3 ? '#00ff00' : '#666',
                        color: inicialesJ1.length === 3 ? 'black' : '#ccc',
                        fontSize: '0.7em',
                        padding: '0.3em 0.8em',
                        minWidth: '4em',
                        cursor: inicialesJ1.length === 3 && !guardandoIndividual ? 'pointer' : 'not-allowed'
                      }}
                      onClick={manejarGuardarJ1}
                      disabled={inicialesJ1.length !== 3 || guardandoIndividual}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              )}

              {j2EsRecord && (
                <div style={{ textAlign: 'center', minWidth: '8em' }}>
                  <p style={{ 
                    marginBottom: '0.5em', 
                    color: '#ffff00',
                    fontSize: '0.9em'
                  }}>
                    P2 - POS #{rankingJ2}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5em', 
                    alignItems: 'center' 
                  }}>
                    <input
                      type="text"
                      style={{
                        width: '4em',
                        height: '2em',
                        fontSize: '1em',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        backgroundColor: 'black',
                        color: '#ffff00',
                        border: '2px solid #ffff00',
                        borderRadius: '0'
                      }}
                      maxLength={3}
                      value={inicialesJ2}
                      onChange={(e) => setInicialesJ2(soloLetras(e.target.value))}
                      placeholder="XYZ"
                      disabled={guardandoIndividual}
                    />
                    <button
                      className="interactive-button"
                      style={{
                        backgroundColor: inicialesJ2.length === 3 ? '#ffff00' : '#666',
                        color: inicialesJ2.length === 3 ? 'black' : '#ccc',
                        fontSize: '0.7em',
                        padding: '0.3em 0.8em',
                        minWidth: '4em',
                        cursor: inicialesJ2.length === 3 && !guardandoIndividual ? 'pointer' : 'not-allowed'
                      }}
                      onClick={manejarGuardarJ2}
                      disabled={inicialesJ2.length !== 3 || guardandoIndividual}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Record de pareja */}
        {parejaEsRecord && !puntajeGuardado && (
          <div style={{ 
            marginBottom: '1.5em', 
            fontSize: '0.875em' 
          }}>
            <h4 style={{ 
              color: '#ff00ff', 
              marginBottom: '1em',
              fontSize: '1.2em'
            }}>
              ¡NUEVO RECORD DE PAREJA!
            </h4>
            <p style={{ marginBottom: '1em' }}>
              POSICION #{rankingPareja} - INGRESA LOS NOMBRES:
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '0.8em', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexWrap: 'wrap' 
            }}>
              <input
                type="text"
                style={{
                  width: '4em',
                  height: '2em',
                  fontSize: '1em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  backgroundColor: 'black',
                  color: '#00ff00',
                  border: '2px solid #00ff00',
                  borderRadius: '0'
                }}
                maxLength={3}
                value={inicialesJ1}
                onChange={(e) => setInicialesJ1(soloLetras(e.target.value))}
                placeholder="ABC"
                disabled={guardandoPareja}
              />
              <span style={{ color: '#fff', fontSize: '1.2em' }}>&</span>
              <input
                type="text"
                style={{
                  width: '4em',
                  height: '2em',
                  fontSize: '1em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  backgroundColor: 'black',
                  color: '#ffff00',
                  border: '2px solid #ffff00',
                  borderRadius: '0'
                }}
                maxLength={3}
                value={inicialesJ2}
                onChange={(e) => setInicialesJ2(soloLetras(e.target.value))}
                placeholder="XYZ"
                disabled={guardandoPareja}
              />
              <button
                className="interactive-button"
                style={{
                  backgroundColor: inicialesJ1.length === 3 && inicialesJ2.length === 3 ? '#ff00ff' : '#666',
                  color: inicialesJ1.length === 3 && inicialesJ2.length === 3 ? 'black' : '#ccc',
                  fontSize: '0.7em',
                  padding: '0.3em 0.8em',
                  minWidth: '6em',
                  cursor: inicialesJ1.length === 3 && inicialesJ2.length === 3 && !guardandoPareja ? 'pointer' : 'not-allowed'
                }}
                onClick={manejarGuardarPareja}
                disabled={inicialesJ1.length !== 3 || inicialesJ2.length !== 3 || guardandoPareja}
              >
                {guardandoPareja ? 'SAVING...' : 'SAVE COUPLE'}
              </button>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        {(puntajeGuardado || (!j1EsRecord && !j2EsRecord && !parejaEsRecord)) && (
          <div>
            {puntajeGuardado && (
              <div style={{ marginBottom: '1em' }}>
                <h5 style={{ 
                  color: '#00ff00', 
                  fontSize: '1em' 
                }}>
                  ¡SCORES GUARDADOS!
                </h5>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1em', 
              alignItems: 'center' 
            }}>
              <button
                className="interactive-button"
                onClick={() => iniciarJuego('2P')}
                style={{
                  fontSize: '1.125em',
                  minWidth: '12em'
                }}
              >
                [ JUGAR DE NUEVO ]
              </button>
              <button
                className="interactive-button"
                onClick={volverAlMenuPrincipal}
                style={{
                  fontSize: '1.125em',
                  minWidth: '12em'
                }}
              >
                [ MENÚ PRINCIPAL ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PantallaGameOver