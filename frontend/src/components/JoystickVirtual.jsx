import React, { useState, useRef, useEffect } from 'react'

function JoystickVirtual({ onMover, onDisparar, style }) {
  const [arrastrando, setArrastrando] = useState(false)
  const [posicion, setPosicion] = useState({ x: 0, y: 0 })
  const joystickRef = useRef(null)
  const containerRef = useRef(null)

  const manejarInicio = (clientX, clientY) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centroX = rect.width / 2
    const centroY = rect.height / 2
    const x = clientX - rect.left - centroX
    const y = clientY - rect.top - centroY
    const distancia = Math.sqrt(x * x + y * y)
    const distanciaMaxima = centroX * 0.6

    if (distancia > distanciaMaxima) {
      const angulo = Math.atan2(y, x)
      setPosicion({
        x: Math.cos(angulo) * distanciaMaxima,
        y: Math.sin(angulo) * distanciaMaxima
      })
    } else {
      setPosicion({ x, y })
    }

    setArrastrando(true)
    onMover(x, y, distancia > 5)
  }

  const manejarMovimiento = (clientX, clientY) => {
    if (!arrastrando || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centroX = rect.width / 2
    const centroY = rect.height / 2
    const x = clientX - rect.left - centroX
    const y = clientY - rect.top - centroY
    const distancia = Math.sqrt(x * x + y * y)
    const distanciaMaxima = centroX * 0.6

    if (distancia > distanciaMaxima) {
      const angulo = Math.atan2(y, x)
      setPosicion({
        x: Math.cos(angulo) * distanciaMaxima,
        y: Math.sin(angulo) * distanciaMaxima
      })
    } else {
      setPosicion({ x, y })
    }

    onMover(x, y, distancia > 5)
  }

  const manejarFin = () => {
    if (arrastrando) {
      setPosicion({ x: 0, y: 0 })
      setArrastrando(false)
      onMover(0, 0, false)
    }
  }

  useEffect(() => {
    // ✅ Manejador para touchstart (registrado manualmente con passive: false)
    const manejarTouchStart = (e) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        manejarInicio(touch.clientX, touch.clientY)
      }
    }

    const manejarTouchMove = (e) => {
      if (arrastrando && e.touches.length > 0) {
        const touch = e.touches[0]
        manejarMovimiento(touch.clientX, touch.clientY)
      }
    }

    const manejarTouchEnd = () => manejarFin()

    // ✅ Registrar touchstart en el contenedor
    if (containerRef.current) {
      containerRef.current.addEventListener('touchstart', manejarTouchStart, { passive: false })
    }

    // ✅ Registrar eventos globales solo si estamos arrastrando
    if (arrastrando) {
      window.addEventListener('touchmove', manejarTouchMove, { passive: false })
      window.addEventListener('touchend', manejarTouchEnd)
      window.addEventListener('mouseup', manejarFin)
    }

    // ✅ Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchstart', manejarTouchStart)
      }
      window.removeEventListener('touchmove', manejarTouchMove)
      window.removeEventListener('touchend', manejarTouchEnd)
      window.removeEventListener('mouseup', manejarFin)
    }
  }, [arrastrando])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style
      }}
      // ❌ onTouchStart REMOVIDO — ahora se registra en useEffect
      onMouseDown={(e) => {
        e.preventDefault()
        manejarInicio(e.clientX, e.clientY)
      }}
    >
      <div
        ref={joystickRef}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transform: `translate(${posicion.x}px, ${posicion.y}px)`,
          transition: arrastrando ? 'none' : 'transform 0.1s ease-out'
        }}
      />
    </div>
  )
}

export default JoystickVirtual