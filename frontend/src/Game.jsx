import React, { useEffect } from 'react'
import { ProveedorContextoJuego, useContextoJuego } from './contexts/ContextoJuego'
import { apiPuntajes } from './services/apiPuntajes'
import PantallaInicio from './components/PantallaInicio'
import MotorJuego from './components/MotorJuego'
import PantallaPausa from './components/PantallaPausa'
import PantallaGameOver from './components/PantallaGameOver'
import PantallaRanking from './components/PantallaRanking'
import PantallaCambioTurno from './components/PantallaCambioTurno'

// Componente que maneja la lógica del juego principal
function JuegoCompleto1942() {
  const { 
    estadoJuego,
    modoJuego,
    jugadorActual,
    puntuacionJ1,
    puntuacionJ2,
    vidasJ1,
    vidasJ2,
    puntuacionTotal,
    puntajesAltos, 
    puntajesParejas,
    setPuntajesAltos,
    setPuntajesParejas,
    setCargandoPuntajes, 
    setErrorPuntajes,
    setJugadorActual
  } = useContextoJuego()

  // Manejo global del botón de pausa con ESC
  useEffect(() => {
    const manejarTeclado = (e) => {
      if (e.code === 'Escape') {
        e.preventDefault()
        // La lógica de pausa se maneja ahora en MotorJuego
      }
    }

    window.addEventListener('keydown', manejarTeclado)
    return () => window.removeEventListener('keydown', manejarTeclado)
  }, [])

  // Cargar puntajes individuales desde la base de datos
  const cargarPuntajesAltos = async () => {
    setCargandoPuntajes(true)
    setErrorPuntajes(null)
    try {
      const puntajes = await apiPuntajes.obtenerTodos()
      setPuntajesAltos(puntajes)
      return puntajes
    } catch (error) {
      console.error('Error loading scores:', error)
      setErrorPuntajes(error.message)
      setPuntajesAltos([])
      return []
    } finally {
      setCargandoPuntajes(false)
    }
  }

  // Cargar puntajes de parejas desde la base de datos
  const cargarPuntajesParejas = async () => {
    setCargandoPuntajes(true)
    setErrorPuntajes(null)
    try {
      const puntajes = await apiPuntajes.obtenerParejas()
      setPuntajesParejas(puntajes)
      return puntajes
    } catch (error) {
      console.error('Error loading couples scores:', error)
      setErrorPuntajes(error.message)
      setPuntajesParejas([])
      return []
    } finally {
      setCargandoPuntajes(false)
    }
  }

  // Guardar puntaje individual en la base de datos
  const guardarPuntaje = async (iniciales, puntajeJugador) => {
    try {
      const resultado = await apiPuntajes.crear(iniciales, puntajeJugador)
      await cargarPuntajesAltos()
      return resultado
    } catch (error) {
      console.error('Error saving score:', error)
      throw error
    }
  }

  // Guardar puntaje de pareja en la base de datos
  const guardarPuntajePareja = async (inicialesJ1, inicialesJ2) => {
    try {
      const resultado = await apiPuntajes.crearPareja(inicialesJ1, puntuacionJ1, inicialesJ2, puntuacionJ2)
      await cargarPuntajesParejas()
      return resultado
    } catch (error) {
      console.error('Error saving couples score:', error)
      throw error
    }
  }

  // Obtener ranking del puntaje actual individual
  const obtenerRankingPuntaje = (puntajeJugador) => {
    if (!puntajesAltos || puntajesAltos.length === 0) {
      return puntajeJugador > 0 ? 1 : null
    }

    const puntajesTemp = [...puntajesAltos, { initials: 'YOU', score: puntajeJugador }]
      .sort((a, b) => b.score - a.score)
    
    const posicion = puntajesTemp.findIndex(p => p.initials === 'YOU' && p.score === puntajeJugador)
    
    return (posicion >= 0 && posicion < 10) ? posicion + 1 : null
  }

  // Obtener ranking del puntaje total de la pareja
  const obtenerRankingPareja = () => {
    if (!puntajesParejas || puntajesParejas.length === 0) {
      return puntuacionTotal > 0 ? 1 : null
    }

    const puntajesTemp = [...puntajesParejas, { total_score: puntuacionTotal }]
      .sort((a, b) => b.total_score - a.total_score)
    
    const posicion = puntajesTemp.findIndex(p => p.total_score === puntuacionTotal)
    
    return (posicion >= 0 && posicion < 10) ? posicion + 1 : null
  }

  // Detectar cambio de turno por muerte del jugador
  const [jugadorAnterior, setJugadorAnterior] = React.useState(1)
  const [mostrandoCambioTurno, setMostrandoCambioTurno] = React.useState(false)

  useEffect(() => {
    if (modoJuego === '2P' && estadoJuego === 'playing' && jugadorActual !== jugadorAnterior) {
      // Se cambió de jugador
      setMostrandoCambioTurno(true)
      setJugadorAnterior(jugadorActual)
      
      // Ocultar pantalla de cambio después de 3 segundos
      setTimeout(() => {
        setMostrandoCambioTurno(false)
      }, 3000)
    }
  }, [jugadorActual, jugadorAnterior, modoJuego, estadoJuego])

  // Cargar puntajes al inicio y cuando se muestra el ranking
  useEffect(() => {
    if (estadoJuego === 'ranking') {
      cargarPuntajesAltos()
      cargarPuntajesParejas()
    }
  }, [estadoJuego])

  // Cargar puntajes al montar el componente
  useEffect(() => {
    cargarPuntajesAltos()
    cargarPuntajesParejas()
  }, [])

  return (
    <div className="game-container">
      <div className="game-wrapper">
        {estadoJuego === 'start' && <PantallaInicio />}
        
        {estadoJuego === 'playing' && (
          <>
            {mostrandoCambioTurno && modoJuego === '2P' ? (
              <PantallaCambioTurno />
            ) : (
              <MotorJuego />
            )}
          </>
        )}
        
        {estadoJuego === 'paused' && <PantallaPausa />}
        
        {estadoJuego === 'gameOver' && (
          <PantallaGameOver
            onGuardarPuntaje={guardarPuntaje}
            onGuardarPuntajePareja={guardarPuntajePareja}
            rankingJ1={obtenerRankingPuntaje(puntuacionJ1)}
            rankingJ2={obtenerRankingPuntaje(puntuacionJ2)}
            rankingPareja={obtenerRankingPareja()}
          />
        )}
        
        {estadoJuego === 'ranking' && <PantallaRanking />}
      </div>
    </div>
  )
}

// Componente principal que envuelve todo con el contexto
export default function Complete1942Game() {
  return (
    <ProveedorContextoJuego>
      <JuegoCompleto1942 />
    </ProveedorContextoJuego>
  )
}