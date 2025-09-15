import React, { useEffect } from 'react'
import { ProveedorContextoJuego, useContextoJuego } from './contexts/ContextoJuego'
import { apiPuntajes } from './services/apiPuntajes'
import PantallaInicio from './components/PantallaInicio'
import MotorJuego from './components/MotorJuego'
import PantallaPausa from './components/PantallaPausa'
import PantallaGameOver from './components/PantallaGameOver'
import PantallaRanking from './components/PantallaRanking'

// Componente que maneja la lógica del juego principal
function JuegoCompleto1942() {
  const { 
    estadoJuego, 
    puntuacion,
    puntajesAltos, 
    setPuntajesAltos,
    setCargandoPuntajes, 
    setErrorPuntajes 
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

  // Cargar puntajes desde la base de datos
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

  // Guardar puntaje en la base de datos
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

  // Obtener ranking del puntaje actual - CORREGIDO
  const obtenerRankingPuntaje = () => {
    // Si no hay puntajes cargados, cargarlos primero
    if (!puntajesAltos || puntajesAltos.length === 0) {
      return puntuacion > 0 ? 1 : null // Si hay puntaje pero no hay records, es #1
    }

    // Crear array temporal con los puntajes existentes más el actual
    const puntajesTemp = [...puntajesAltos, { initials: 'YOU', score: puntuacion }]
      .sort((a, b) => b.score - a.score) // Ordenar de mayor a menor
    
    // Encontrar la posición del puntaje actual
    const posicion = puntajesTemp.findIndex(p => p.initials === 'YOU' && p.score === puntuacion)
    
    // Solo devolver la posición si está en el top 10 (índices 0-9)
    return (posicion >= 0 && posicion < 10) ? posicion + 1 : null
  }

  // Cargar puntajes al inicio y cuando se muestra el ranking
  useEffect(() => {
    if (estadoJuego === 'ranking') {
      cargarPuntajesAltos()
    }
  }, [estadoJuego])

  // Cargar puntajes al montar el componente
  useEffect(() => {
    cargarPuntajesAltos()
  }, [])

  return (
    <div className="game-container">
      <div className="game-wrapper">
        {estadoJuego === 'start' && <PantallaInicio />}
        
        {estadoJuego === 'playing' && <MotorJuego />}
        
        {estadoJuego === 'paused' && <PantallaPausa />}
        
        {estadoJuego === 'gameOver' && (
          <PantallaGameOver
            onGuardarPuntaje={guardarPuntaje}
            ranking={obtenerRankingPuntaje()}
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