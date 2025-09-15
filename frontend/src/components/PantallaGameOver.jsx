import React, { useState } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

function PantallaGameOver({ onGuardarPuntaje, ranking }) {
  const { puntuacion, iniciarJuego, volverAlMenuPrincipal } = useContextoJuego()
  const [iniciales, setIniciales] = useState('')
  const [puntajeGuardado, setPuntajeGuardado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // Corregir la lógica del ranking - debe ser número válido y menor o igual a 10
  const esNuevoRecord = ranking && ranking > 0 && ranking <= 10

  const manejarGuardarPuntaje = async () => {
    if (iniciales.length === 3) {
      setGuardando(true)
      try {
        await onGuardarPuntaje(iniciales, puntuacion)
        setPuntajeGuardado(true)
      } catch (error) {
        console.error('Error saving score:', error)
      } finally {
        setGuardando(false)
      }
    }
  }

  const manejarKeyDown = (e) => {
    if (e.key === 'Enter' && iniciales.length === 3 && !guardando) {
      manejarGuardarPuntaje()
    }
  }

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
        <h2 style={{ marginBottom: '30px' }}>SCORE: {puntuacion.toLocaleString().padStart(8, '0')}</h2>

        {esNuevoRecord && !puntajeGuardado && (
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#ffff00', marginBottom: '15px' }}>
              ¡NUEVO HIGH SCORE!
            </h4>
            <p style={{ fontSize: '16px', marginBottom: '15px' }}>
              POSICION #{ranking} - INGRESA TUS INICIALES:
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
                value={iniciales}
                onChange={(e) => setIniciales(e.target.value.toUpperCase())}
                onKeyDown={manejarKeyDown}
                autoFocus
                disabled={guardando}
                placeholder="ABC"
              />
              <button
                style={{ 
                  backgroundColor: iniciales.length === 3 ? 'white' : '#666',
                  color: iniciales.length === 3 ? 'black' : '#ccc',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '18px',
                  cursor: iniciales.length === 3 && !guardando ? 'pointer' : 'not-allowed',
                  fontFamily: '"Pixelify Sans", monospace',
                  textTransform: 'uppercase'
                }}
                onClick={manejarGuardarPuntaje}
                disabled={iniciales.length !== 3 || guardando}
              >
                {guardando ? 'GUARDANDO...' : 'GUARDAR'}
              </button>
            </div>
            {iniciales.length < 3 && (
              <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                Ingresa exactamente 3 letras
              </p>
            )}
          </div>
        )}

        {(puntajeGuardado || !esNuevoRecord) && (
          <div className="text-center">
            {puntajeGuardado && (
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ color: '#00ff00', fontSize: '18px' }}>
                  ¡SCORE GUARDADO, {iniciales}!
                </h5>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <div 
                onClick={iniciarJuego} 
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

export default PantallaGameOver