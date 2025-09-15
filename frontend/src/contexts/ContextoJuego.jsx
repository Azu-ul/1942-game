import React, { createContext, useContext, useState } from 'react'

const ContextoJuego = createContext()

export function ProveedorContextoJuego({ children }) {
  const [estadoJuego, setEstadoJuego] = useState('start') // 'start', 'playing', 'paused', 'gameOver', 'ranking'
  const [puntuacion, setPuntuacion] = useState(0)
  const [vidas, setVidas] = useState(3)
  const [puntajesAltos, setPuntajesAltos] = useState([])
  const [cargandoPuntajes, setCargandoPuntajes] = useState(false)
  const [errorPuntajes, setErrorPuntajes] = useState(null)

  const iniciarJuego = () => {
    setPuntuacion(0)
    setVidas(3)
    setEstadoJuego('playing')
  }

  const pausarJuego = () => setEstadoJuego('paused')
  const reanudarJuego = () => setEstadoJuego('playing')
  const finalizarJuego = () => setEstadoJuego('gameOver')
  const volverAlMenuPrincipal = () => setEstadoJuego('start')
  const mostrarRanking = () => setEstadoJuego('ranking')

  const valor = {
    // Estados
    estadoJuego,
    puntuacion,
    vidas,
    puntajesAltos,
    cargandoPuntajes,
    errorPuntajes,
    
    // Setters
    setEstadoJuego,
    setPuntuacion,
    setVidas,
    setPuntajesAltos,
    setCargandoPuntajes,
    setErrorPuntajes,
    
    // Acciones
    iniciarJuego,
    pausarJuego,
    reanudarJuego,
    finalizarJuego,
    volverAlMenuPrincipal,
    mostrarRanking
  }

  return (
    <ContextoJuego.Provider value={valor}>
      {children}
    </ContextoJuego.Provider>
  )
}

export function useContextoJuego() {
  const contexto = useContext(ContextoJuego)
  if (!contexto) {
    throw new Error('useContextoJuego debe usarse dentro de un ProveedorContextoJuego')
  }
  return contexto
}