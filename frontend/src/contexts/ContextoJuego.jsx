import React, { createContext, useContext, useState } from 'react'

const ContextoJuego = createContext()

export function ProveedorContextoJuego({ children }) {
  const [estadoJuego, setEstadoJuego] = useState('start') // 'start', 'playing', 'paused', 'gameOver', 'ranking'

  // Estados para 2 jugadores
  const [modoJuego, setModoJuego] = useState('1P') // '1P' o '2P'
  const [jugadorActual, setJugadorActual] = useState(1) // 1 o 2
  const [jugadorAnterior, setJugadorAnterior] = useState(1) // 🔥 Nuevo: para detectar cambios reales de turno

  // Puntuaciones y vidas por jugador
  const [puntuacionJ1, setPuntuacionJ1] = useState(0)
  const [puntuacionJ2, setPuntuacionJ2] = useState(0)
  const [vidasJ1, setVidasJ1] = useState(3)
  const [vidasJ2, setVidasJ2] = useState(3)

  // FLAG explícito para mostrar la pantalla de cambio de turno
  const [mostrarCambioTurno, setMostrarCambioTurno] = useState(false)

  // Rankings
  const [puntajesAltos, setPuntajesAltos] = useState([])
  const [puntajesParejas, setPuntajesParejas] = useState([])
  const [cargandoPuntajes, setCargandoPuntajes] = useState(false)
  const [errorPuntajes, setErrorPuntajes] = useState(null)

  // Getters computados
  const puntuacion = jugadorActual === 1 ? puntuacionJ1 : puntuacionJ2
  const vidas = jugadorActual === 1 ? vidasJ1 : vidasJ2
  const puntuacionTotal = puntuacionJ1 + puntuacionJ2

  const iniciarJuego = (modo = '1P') => {
    setModoJuego(modo)
    setPuntuacionJ1(0)
    setPuntuacionJ2(0)
    setVidasJ1(3)
    setVidasJ2(3)
    setJugadorActual(1)
    setJugadorAnterior(1) // ✅ Reset correcto
    setMostrarCambioTurno(false) // ✅ Reset del flag
    setEstadoJuego('playing')
  }

  // setter de puntuación
  const setPuntuacion = (valor) => {
    if (jugadorActual === 1) {
      setPuntuacionJ1(typeof valor === 'function' ? valor(puntuacionJ1) : valor)
    } else {
      setPuntuacionJ2(typeof valor === 'function' ? valor(puntuacionJ2) : valor)
    }
  }

  // setter de vidas: cuando un jugador llega a 0, en 2P cambiamos turno y activamos mostrarCambioTurno
  const setVidas = (valor) => {
    const nuevasVidas = typeof valor === 'function' ? valor(vidas) : valor

    if (jugadorActual === 1) {
      setVidasJ1(nuevasVidas)
    } else {
      setVidasJ2(nuevasVidas)
    }

    if (nuevasVidas <= 0) {
      if (modoJuego === '2P') {
        const otroJugador = jugadorActual === 1 ? 2 : 1
        const vidasOtroJugador = jugadorActual === 1 ? vidasJ2 : vidasJ1

        if (vidasOtroJugador > 0) {
          setJugadorActual(otroJugador)
          setMostrarCambioTurno(true)
          return nuevasVidas
        }
      }
      finalizarJuego()
    }

    return nuevasVidas
  }

  const pausarJuego = () => setEstadoJuego('paused')
  const reanudarJuego = () => setEstadoJuego('playing')
  const finalizarJuego = () => setEstadoJuego('gameOver')
  const volverAlMenuPrincipal = () => {
    setEstadoJuego('start')
    setMostrarCambioTurno(false)
  }
  const mostrarRanking = () => setEstadoJuego('ranking')

  const valor = {
    // Estados básicos
    estadoJuego,
    // Estados de jugadores
    modoJuego,
    jugadorActual,
    jugadorAnterior,        // 🔥 expuesto
    puntuacionJ1,
    puntuacionJ2,
    vidasJ1,
    vidasJ2,
    // FLAGS
    mostrarCambioTurno,
    setMostrarCambioTurno,
    // Getters computados
    puntuacion,
    vidas,
    puntuacionTotal,
    // Rankings
    puntajesAltos,
    puntajesParejas,
    cargandoPuntajes,
    errorPuntajes,
    // Setters
    setEstadoJuego,
    setModoJuego,
    setJugadorActual,
    setJugadorAnterior,     // 🔥 expuesto
    setPuntuacion,
    setVidas,
    setPuntajesAltos,
    setPuntajesParejas,
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