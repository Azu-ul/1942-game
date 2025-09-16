import React, { useState } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

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

  // ✅ FUNCIÓN PARA FILTRAR SOLO LETRAS
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
        width: ANCHO_JUEGO,
        height: ALTO_JUEGO,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="text-center text-white" style={{ fontSize: '24px', width: '100%' }}>
          <h1 style={{ marginBottom: '20px', color: '#ff0000' }}>GAME OVER</h1>
          <h2 style={{ marginBottom: '30px' }}>SCORE: {puntuacionJ1.toLocaleString().padStart(8, '0')}</h2>

          {j1EsRecord && !puntajeGuardado && (
            <div className="text-center" style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ffff00', marginBottom: '15px' }}>
                ¡NUEVO HIGH SCORE!
              </h4>
              <p style={{ fontSize: '16px', marginBottom: '15px' }}>
                POSICION #{rankingJ1} - INGRESA TUS INICIALES:
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  style={{
                    width: '120px',
                    height: '50px',
                    fontSize: '24px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    backgroundColor: 'black',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: '0',
                    fontFamily: '"Pixelify Sans", monospace'
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
                  style={{
                    backgroundColor: inicialesJ1.length === 3 ? 'white' : '#666',
                    color: inicialesJ1.length === 3 ? 'black' : '#ccc',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '18px',
                    cursor: inicialesJ1.length === 3 && !guardandoIndividual ? 'pointer' : 'not-allowed',
                    fontFamily: '"Pixelify Sans", monospace',
                    textTransform: 'uppercase'
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
            <div className="text-center">
              {puntajeGuardado && (
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ color: '#00ff00', fontSize: '18px' }}>
                    ¡SCORE GUARDADO, {inicialesJ1}!
                  </h5>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                <div
                  onClick={() => iniciarJuego('1P')}
                  style={{
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '10px 20px',
                    border: '2px solid white',
                    backgroundColor: 'transparent',
                    color: 'white',
                    minWidth: '250px',
                    textAlign: 'center'
                  }}
                >
                  [ JUGAR DE NUEVO ]
                </div>
                <div
                  onClick={volverAlMenuPrincipal}
                  style={{
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '10px 20px',
                    border: '2px solid white',
                    backgroundColor: 'transparent',
                    color: 'white',
                    minWidth: '250px',
                    textAlign: 'center'
                  }}
                >
                  [ MENÚ PRINCIPAL ]
                </div>
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
      width: ANCHO_JUEGO,
      height: ALTO_JUEGO,
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="text-center text-white" style={{ fontSize: '20px', width: '100%' }}>
        <h1 style={{ marginBottom: '20px', color: '#ff0000' }}>GAME OVER</h1>

        <div style={{ marginBottom: '25px', fontSize: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#00ff00' }}>P1: {puntuacionJ1.toLocaleString()}</span>
            <span style={{ color: '#ffff00' }}>P2: {puntuacionJ2.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '22px', color: '#ffffff' }}>
            TOTAL: {puntuacionTotal.toLocaleString()}
          </div>
        </div>

        {/* Records individuales */}
        {(j1EsRecord || j2EsRecord) && !puntajeGuardado && (
          <div style={{ marginBottom: '25px', fontSize: '14px' }}>
            <h4 style={{ color: '#ffff00', marginBottom: '15px' }}>
              ¡NUEVOS RECORDS INDIVIDUALES!
            </h4>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {j1EsRecord && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '10px', color: '#00ff00' }}>
                    P1 - POSICION #{rankingJ1}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      style={{
                        width: '80px',
                        height: '35px',
                        fontSize: '16px',
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
                      style={{
                        backgroundColor: inicialesJ1.length === 3 ? '#00ff00' : '#666',
                        color: inicialesJ1.length === 3 ? 'black' : '#ccc',
                        border: 'none',
                        padding: '5px 15px',
                        fontSize: '12px',
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
                <div style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '10px', color: '#ffff00' }}>
                    P2 - POSICION #{rankingJ2}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      style={{
                        width: '80px',
                        height: '35px',
                        fontSize: '16px',
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
                      style={{
                        backgroundColor: inicialesJ2.length === 3 ? '#ffff00' : '#666',
                        color: inicialesJ2.length === 3 ? 'black' : '#ccc',
                        border: 'none',
                        padding: '5px 15px',
                        fontSize: '12px',
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
          <div style={{ marginBottom: '25px', fontSize: '14px' }}>
            <h4 style={{ color: '#ff00ff', marginBottom: '15px' }}>
              ¡NUEVO RECORD DE PAREJA!
            </h4>
            <p style={{ marginBottom: '15px' }}>
              POSICION #{rankingPareja} - INGRESA LOS NOMBRES:
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                style={{
                  width: '80px',
                  height: '35px',
                  fontSize: '16px',
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
              <span style={{ color: '#fff' }}>&</span>
              <input
                type="text"
                style={{
                  width: '80px',
                  height: '35px',
                  fontSize: '16px',
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
                style={{
                  backgroundColor: inicialesJ1.length === 3 && inicialesJ2.length === 3 ? '#ff00ff' : '#666',
                  color: inicialesJ1.length === 3 && inicialesJ2.length === 3 ? 'black' : '#ccc',
                  border: 'none',
                  padding: '5px 15px',
                  fontSize: '12px',
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
          <div className="text-center">
            {puntajeGuardado && (
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ color: '#00ff00', fontSize: '16px' }}>
                  ¡SCORES GUARDADOS!
                </h5>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <div
                onClick={() => {
                  // reset explícito de todo
                  iniciarJuego('2P')
                }}
                style={{
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '10px 20px',
                  border: '2px solid white',
                  backgroundColor: 'transparent',
                  color: 'white',
                  minWidth: '250px',
                  textAlign: 'center'
                }}
              >
                [ JUGAR DE NUEVO ]
              </div>
              <div
                onClick={volverAlMenuPrincipal}
                style={{
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '10px 20px',
                  border: '2px solid white',
                  backgroundColor: 'transparent',
                  color: 'white',
                  minWidth: '250px',
                  textAlign: 'center'
                }}
              >
                [ MENÚ PRINCIPAL ]
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PantallaGameOver