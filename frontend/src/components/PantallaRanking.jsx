import React from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import { ANCHO_JUEGO, ALTO_JUEGO } from '../constants/constantesJuego'

function PantallaRanking() {
  const { 
    volverAlMenuPrincipal, 
    puntajesAltos, 
    cargandoPuntajes, 
    errorPuntajes 
  } = useContextoJuego()

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
        <h1 className="text-center text-white" style={{ 
          marginBottom: '30px',
          fontSize: '28px',
          color: '#ffff00'
        }}>
          HIGH SCORES
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
            gap: '8px'
          }}>
            {puntajesAltos.length > 0 ? (
              <>
                {/* Header del ranking */}
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
                
                {/* Lista de scores */}
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
                      fontSize: '18px',
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
                      minWidth: '120px', 
                      textAlign: 'right',
                      fontFamily: 'monospace'
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
                <p>NO HAY SCORES REGISTRADOS AÚN</p>
                <p style={{ fontSize: '14px', marginTop: '20px' }}>
                  ¡SÉ EL PRIMERO EN APARECER AQUÍ!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón volver */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <div 
          onClick={volverAlMenuPrincipal} 
          style={{ 
            cursor: 'pointer', 
            fontSize: '20px',
            padding: '15px 30px',
            border: '2px solid white',
            backgroundColor: 'transparent',
            color: 'white',
            textAlign: 'center',
            minWidth: '200px',
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
          [ VOLVER ]
        </div>
      </div>
    </div>
  )
}

export default PantallaRanking
