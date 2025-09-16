import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useContextoJuego } from '../contexts/ContextoJuego'
import useTeclado from '../hooks/useTeclado'
import Jugador from './Jugador'
import Balas from './Balas'
import Enemigo from './Enemigo'
import JoystickVirtual from './JoystickVirtual'
import BotonDisparoVirtual from './BotonDisparoVirtual'
import {
  ANCHO_JUEGO,
  ALTO_JUEGO,
  VELOCIDAD_JUGADOR,
  VELOCIDAD_BALA,
  VELOCIDAD_BALA_ENEMIGO,
  TIEMPO_RECARGA_BALA,
  MIN_INTERVALO_RAFAGA,
  MAX_INTERVALO_RAFAGA,
  MIN_CANTIDAD_RAFAGA,
  MAX_CANTIDAD_RAFAGA,
  VELOCIDAD_ENEMIGO,
  VELOCIDAD_ENEMIGO_VERDE,
  DURACION_DESACELERACION,
  ALTURA_IMAGEN_FONDO
} from '../constants/constantesJuego'

// Componente optimizado para mostrar vidas como avioncitos
const VidasDisplay = React.memo(({ vidas, vidasPerdidas, jugador }) => {
  return (
    <div className="position-absolute" style={{ 
      bottom: jugador === 1 ? '20px' : '60px', 
      left: '20px', 
      zIndex: 20 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: jugador === 1 ? '#00ff00' : '#ffff00',
        marginBottom: '5px'
      }}>
        P{jugador}
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {[...Array(3)].map((_, i) => (
          <img
            key={i}
            src="/assets/avion_recto.png"
            alt="vida"
            style={{
              width: '16px',
              height: '16px',
              imageRendering: 'pixelated',
              opacity: i >= vidas ? 0.3 : 1,
              animation: vidasPerdidas.includes(i) ? 'parpadeo 0.5s ease-out' : 'none'
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes parpadeo {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
})

// Componente HUD optimizado para 2 jugadores
const HUDDisplay = React.memo(({ 
  modoJuego, 
  jugadorActual, 
  puntuacionJ1, 
  puntuacionJ2, 
  puntajeMaximo, 
  puntajeMaximoPareja 
}) => {
  if (modoJuego === '1P') {
    return (
      <div className="position-absolute top-0 w-100 d-flex justify-content-between align-items-center p-2"
        style={{ fontSize: '14px', color: 'white', zIndex: 20 }}>
        <div>1UP</div>
        <div style={{ marginLeft: '10px' }}>{puntuacionJ1.toLocaleString().padStart(8, '0')}</div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div>HIGH SCORE</div>
          <div>{puntajeMaximo.toLocaleString().padStart(8, '0')}</div>
        </div>

        <div>2UP</div>
        <div style={{ marginLeft: '10px' }}>00000000</div>
      </div>
    )
  }

  // Modo 2P
  return (
    <div className="position-absolute top-0 w-100 p-2" style={{ fontSize: '12px', color: 'white', zIndex: 20 }}>
      {/* Primera fila */}
      <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '5px' }}>
        <div style={{ color: jugadorActual === 1 ? '#00ff00' : 'white' }}>
          P1: {puntuacionJ1.toLocaleString().padStart(8, '0')}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>2P HIGH SCORE</div>
          <div>{puntajeMaximoPareja.toLocaleString().padStart(8, '0')}</div>
        </div>
        <div style={{ color: jugadorActual === 2 ? '#ffff00' : 'white' }}>
          P2: {puntuacionJ2.toLocaleString().padStart(8, '0')}
        </div>
      </div>
      
      {/* Segunda fila */}
      <div className="text-center" style={{ fontSize: '14px' }}>
        <div style={{ 
          color: jugadorActual === 1 ? '#00ff00' : '#ffff00',
          fontWeight: 'bold'
        }}>
          PLAYER {jugadorActual} TURN
        </div>
        <div style={{ fontSize: '10px', color: '#ccc' }}>
          TOTAL: {(puntuacionJ1 + puntuacionJ2).toLocaleString()}
        </div>
      </div>
    </div>
  )
})

function MotorJuego() {
  const {
    modoJuego,
    jugadorActual,
    puntuacionJ1,
    puntuacionJ2,
    vidasJ1,
    vidasJ2,
    setPuntuacion,
    setVidas,
    pausarJuego,
    finalizarJuego,
    puntajesAltos,
    puntajesParejas
  } = useContextoJuego()

  const teclas = useTeclado()

  // Estados del juego usando refs para evitar re-renders
  const estadoJuegoRef = useRef({
    jugador: { x: ANCHO_JUEGO / 2 - 16, y: ALTO_JUEGO - 80 },
    balas: [],
    balasEnemigos: [],
    enemigos: [],
    offsetFondoY: 0,
    tiempoRecargaBala: 0,
    temporizadorRafaga: MIN_INTERVALO_RAFAGA + Math.random() * (MAX_INTERVALO_RAFAGA - MIN_INTERVALO_RAFAGA),
    frameCounter: 0
  })

  // Estados visuales optimizados
  const [estadoVisual, setEstadoVisual] = useState({
    jugador: { x: ANCHO_JUEGO / 2 - 16, y: ALTO_JUEGO - 80 },
    balas: [],
    balasEnemigos: [],
    enemigos: [],
    offsetFondoY: 0
  })

  // Estados para efectos visuales
  const [vidasPerdidasJ1, setVidasPerdidasJ1] = useState([])
  const [vidasPerdidasJ2, setVidasPerdidasJ2] = useState([])

  // Controles táctiles
  const [movimientoTactil, setMovimientoTactil] = useState({ x: 0, y: 0, active: false })
  const [disparoTactil, setDisparoTactil] = useState(false)

  const esMobile = useMemo(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), []
  )

  const puntajeMaximo = useMemo(() =>
    puntajesAltos.length > 0 ? puntajesAltos[0].score : 0, [puntajesAltos]
  )

  const puntajeMaximoPareja = useMemo(() =>
    puntajesParejas.length > 0 ? puntajesParejas[0].total_score : 0, [puntajesParejas]
  )

  // Actualizar estado visual solo cada 2 frames para mejorar rendimiento
  const actualizarEstadoVisual = useCallback(() => {
    const gs = estadoJuegoRef.current
    gs.frameCounter++

    // Solo actualizar cada 2 frames
    if (gs.frameCounter % 2 === 0) {
      setEstadoVisual({
        jugador: { ...gs.jugador },
        balas: [...gs.balas],
        balasEnemigos: [...gs.balasEnemigos],
        enemigos: [...gs.enemigos],
        offsetFondoY: gs.offsetFondoY
      })
    }
  }, [])

  // Efecto para parpadeo de vidas
  const manejarPerdidaVida = useCallback(() => {
    const vidas = jugadorActual === 1 ? vidasJ1 : vidasJ2
    const nuevaVidaPerdida = 3 - vidas

    if (jugadorActual === 1) {
      setVidasPerdidasJ1(prev => [...prev, nuevaVidaPerdida])
      setTimeout(() => {
        setVidasPerdidasJ1(prev => prev.filter(v => v !== nuevaVidaPerdida))
      }, 500)
    } else {
      setVidasPerdidasJ2(prev => [...prev, nuevaVidaPerdida])
      setTimeout(() => {
        setVidasPerdidasJ2(prev => prev.filter(v => v !== nuevaVidaPerdida))
      }, 500)
    }
  }, [jugadorActual, vidasJ1, vidasJ2])

  useEffect(() => {
    if (teclas.Escape) {
      pausarJuego()
    }
  }, [teclas.Escape, pausarJuego])

  useEffect(() => {
    let animId
    let ultimoTiempo = performance.now()
    let acumuladorTiempo = 0
    const TIMESTEP = 1000 / 60 // 60 FPS fijo

    const bucleJuego = (tiempoActual) => {
      const deltaTime = tiempoActual - ultimoTiempo
      ultimoTiempo = tiempoActual
      acumuladorTiempo += deltaTime

      // Limitar delta time para evitar saltos grandes
      if (acumuladorTiempo > 100) acumuladorTiempo = TIMESTEP

      while (acumuladorTiempo >= TIMESTEP) {
        const dt = TIMESTEP / 1000
        const gs = estadoJuegoRef.current

        // Mover fondo
        gs.offsetFondoY += 50 * dt
        if (gs.offsetFondoY >= ALTURA_IMAGEN_FONDO) {
          gs.offsetFondoY = 0
        }

        // Mover jugador
        let nx = gs.jugador.x
        let ny = gs.jugador.y

        if (teclas.ArrowLeft) nx -= VELOCIDAD_JUGADOR * dt
        if (teclas.ArrowRight) nx += VELOCIDAD_JUGADOR * dt
        if (teclas.ArrowUp) ny -= VELOCIDAD_JUGADOR * dt
        if (teclas.ArrowDown) ny += VELOCIDAD_JUGADOR * dt

        if (movimientoTactil.active) {
          const velocidadMovimiento = VELOCIDAD_JUGADOR * dt
          if (movimientoTactil.x < -10) nx -= velocidadMovimiento
          if (movimientoTactil.x > 10) nx += velocidadMovimiento
          if (movimientoTactil.y < -10) ny -= velocidadMovimiento
          if (movimientoTactil.y > 10) ny += velocidadMovimiento
        }

        nx = Math.max(0, Math.min(ANCHO_JUEGO - 32, nx))
        ny = Math.max(0, Math.min(ALTO_JUEGO - 32, ny))
        gs.jugador = { x: nx, y: ny }

        // Disparos jugador
        gs.tiempoRecargaBala -= dt
        const estaDisparando = teclas.Space || disparoTactil
        if (estaDisparando && gs.tiempoRecargaBala <= 0) {
          gs.balas.push({
            x: gs.jugador.x + 12,
            y: gs.jugador.y - 20,
            vx: 0,
            vy: -VELOCIDAD_BALA
          })
          gs.tiempoRecargaBala = TIEMPO_RECARGA_BALA
        }

        // Actualizar balas (optimizado)
        for (let i = gs.balas.length - 1; i >= 0; i--) {
          const b = gs.balas[i]
          b.y += b.vy * dt
          if (b.y < -20) {
            gs.balas.splice(i, 1)
          }
        }

        // Spawn enemigos
        gs.temporizadorRafaga -= dt
        if (gs.temporizadorRafaga <= 0) {
          const cantidadRafaga = Math.floor(Math.random() * (MAX_CANTIDAD_RAFAGA - MIN_CANTIDAD_RAFAGA + 1)) + MIN_CANTIDAD_RAFAGA
          for (let i = 0; i < cantidadRafaga; i++) {
            const inicioX = Math.random() * (ANCHO_JUEGO - 32)
            const inicioY = -32 - Math.random() * 100
            const limiteY = ALTO_JUEGO / 2 + Math.random() * (ALTO_JUEGO / 2)
            const vx = (Math.random() - 0.5) * 40
            const vy = VELOCIDAD_ENEMIGO + Math.random() * 30
            gs.enemigos.push({
              x: inicioX,
              y: inicioY,
              vx,
              vy,
              state: 'down',
              limiteY,
              age: 0,
              type: Math.random() < 0.5 ? 'sine' : 'zigzag',
              slowTimer: 0,
              fireCooldown: 1 + Math.random() * 2,
              points: 50
            })
          }
          gs.temporizadorRafaga = MIN_INTERVALO_RAFAGA + Math.random() * (MAX_INTERVALO_RAFAGA - MIN_INTERVALO_RAFAGA)
        }

        // Spawn enemigos verdes (optimizado)
        const puntajeActual = jugadorActual === 1 ? puntuacionJ1 : puntuacionJ2
        if (puntajeActual > 100 && Math.random() < 0.005 && gs.enemigos.filter(e => e.type === 'green').length < 2) {
          const desdeLaIzquierda = Math.random() < 0.5
          const inicioX = desdeLaIzquierda ? -32 : ANCHO_JUEGO
          const inicioY = 100 + Math.random() * (ALTO_JUEGO - 200)
          const radio = 80 + Math.random() * 70

          gs.enemigos.push({
            type: 'green',
            x: inicioX,
            y: inicioY,
            centerX: inicioX + (desdeLaIzquierda ? radio : -radio),
            centerY: inicioY,
            angle: desdeLaIzquierda ? Math.PI : 0,
            radius: radio,
            speed: VELOCIDAD_ENEMIGO_VERDE,
            circleCount: 0,
            points: 100,
            rotation: desdeLaIzquierda ? Math.PI : 0,
            xPrev: inicioX,
            yPrev: inicioY,
            state: 'circle',
            fireCooldown: 1 + Math.random() * 2,
          })
        }

        // Mover enemigos (mantener la lógica existente)
        for (let i = gs.enemigos.length - 1; i >= 0; i--) {
          const e = gs.enemigos[i]
          let nx = e.x
          let ny = e.y
          let age = e.age + dt
          let state = e.state
          let slowTimer = e.slowTimer
          let fireCooldown = e.fireCooldown - dt

          if (e.type === 'green') {
            if (state === 'circle') {
              const deltaAngle = e.speed * dt / e.radius;
              e.angle += deltaAngle;

              nx = e.centerX + Math.cos(e.angle) * e.radius;
              ny = e.centerY + Math.sin(e.angle) * e.radius;

              const dx = nx - e.xPrev;
              const dy = ny - e.yPrev;

              if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                e.rotation = Math.atan2(dy, dx);
              }

              e.xPrev = nx;
              e.yPrev = ny;

              if (e.angle >= 2 * Math.PI) {
                e.angle -= 2 * Math.PI;
                e.circleCount += 1;
                if (e.circleCount >= 2) state = 'exit';
              }

              if (fireCooldown <= 0) {
                const dx = (gs.jugador.x + 14) - (nx + 14);
                const dy = (gs.jugador.y + 14) - (ny + 14);
                const dist = Math.hypot(dx, dy);
                if (dist > 0) {
                  const vxBullet = dx / dist * VELOCIDAD_BALA_ENEMIGO;
                  const vyBullet = dy / dist * VELOCIDAD_BALA_ENEMIGO;
                  gs.balasEnemigos.push({
                    x: nx + 12,
                    y: ny + 12,
                    vx: vxBullet,
                    vy: vyBullet
                  });
                  fireCooldown = 1 + Math.random() * 2;
                }
              }
            } else if (state === 'exit') {
              const dir = e.centerX < ANCHO_JUEGO / 2 ? -1 : 1;
              nx += dir * e.speed * dt;
              e.rotation = dir > 0 ? 0 : Math.PI;
              e.xPrev = nx;
              e.yPrev = ny;

              if (nx < -32 || nx > ANCHO_JUEGO) {
                gs.enemigos.splice(i, 1);
                continue;
              }
            }
          } else {
            nx += e.vx * dt
            ny += e.vy * dt
            if (e.type === 'sine') nx += Math.sin(age * 3) * 20 * dt
            else if (e.type === 'zigzag') nx += Math.sin(age * 5) * 30 * dt

            if (state === 'down' && ny >= e.limiteY && slowTimer <= 0) {
              slowTimer = DURACION_DESACELERACION
              e.vy = e.vy * 0.4
            }
            if (slowTimer > 0) {
              slowTimer -= dt
              if (slowTimer <= 0) {
                e.vy = -VELOCIDAD_ENEMIGO
                state = 'up'
              }
            }
            if (state === 'up' && ny < -32) {
              gs.enemigos.splice(i, 1)
              continue
            }

            if (state === 'down' && fireCooldown <= 0) {
              const dx = (gs.jugador.x + 14) - (nx + 14)
              const dy = (gs.jugador.y + 14) - (ny + 14)
              const dist = Math.hypot(dx, dy)
              if (dist > 0) {
                const vxBullet = dx / dist * VELOCIDAD_BALA_ENEMIGO
                const vyBullet = dy / dist * VELOCIDAD_BALA_ENEMIGO
                gs.balasEnemigos.push({
                  x: nx + 12,
                  y: ny + 12,
                  vx: vxBullet,
                  vy: vyBullet
                })
                fireCooldown = 1 + Math.random() * 2
              }
            }
          }

          e.x = nx
          e.y = ny
          e.age = age
          e.state = state
          e.slowTimer = slowTimer
          e.fireCooldown = fireCooldown
        }

        // Mover balas enemigas (optimizado)
        for (let i = gs.balasEnemigos.length - 1; i >= 0; i--) {
          const b = gs.balasEnemigos[i]
          b.x += b.vx * dt
          b.y += b.vy * dt

          if (b.x < 0 || b.x > ANCHO_JUEGO || b.y < 0 || b.y > ALTO_JUEGO) {
            gs.balasEnemigos.splice(i, 1)
          }
        }

        // Colisiones (optimizadas)
        // Balas jugador vs enemigos
        for (let bi = gs.balas.length - 1; bi >= 0; bi--) {
          const b = gs.balas[bi]
          for (let ei = gs.enemigos.length - 1; ei >= 0; ei--) {
            const en = gs.enemigos[ei]
            if (b.x < en.x + 28 && b.x + 8 > en.x && b.y < en.y + 28 && b.y + 16 > en.y) {
              gs.balas.splice(bi, 1)
              gs.enemigos.splice(ei, 1)
              setPuntuacion(prev => prev + en.points)
              break
            }
          }
        }

        // Balas enemigas vs jugador
        for (let bi = gs.balasEnemigos.length - 1; bi >= 0; bi--) {
          const b = gs.balasEnemigos[bi]
          const p = gs.jugador
          if (p.x < b.x + 8 && p.x + 28 > b.x && p.y < b.y + 16 && p.y + 28 > b.y) {
            gs.balasEnemigos.splice(bi, 1)
            manejarPerdidaVida()
            setVidas(prev => {
              const nuevasVidas = prev - 1
              if (nuevasVidas <= 0 && modoJuego === '2P') {
                // En modo 2P, el juego se maneja en el contexto
              } else if (nuevasVidas <= 0) {
                finalizarJuego()
              }
              return nuevasVidas
            })
            gs.jugador = { x: ANCHO_JUEGO / 2 - 16, y: ALTO_JUEGO - 80 }
            break
          }
        }

        // Enemigos vs jugador
        for (let ei = gs.enemigos.length - 1; ei >= 0; ei--) {
          const en = gs.enemigos[ei]
          const p = gs.jugador
          if (p.x < en.x + 28 && p.x + 28 > en.x && p.y < en.y + 28 && p.y + 28 > en.y) {
            gs.enemigos.splice(ei, 1)
            manejarPerdidaVida()
            setVidas(prev => {
              const nuevasVidas = prev - 1
              if (nuevasVidas <= 0 && modoJuego === '2P') {
                // En modo 2P, el juego se maneja en el contexto
              } else if (nuevasVidas <= 0) {
                finalizarJuego()
              }
              return nuevasVidas
            })
            gs.jugador = { x: ANCHO_JUEGO / 2 - 16, y: ALTO_JUEGO - 80 }
            break
          }
        }

        acumuladorTiempo -= TIMESTEP
      }

      // Actualizar estado visual
      actualizarEstadoVisual()

      animId = requestAnimationFrame(bucleJuego)
    }

    animId = requestAnimationFrame(bucleJuego)

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [teclas, movimientoTactil, disparoTactil, jugadorActual, puntuacionJ1, puntuacionJ2, modoJuego, pausarJuego, finalizarJuego, setPuntuacion, setVidas, actualizarEstadoVisual, manejarPerdidaVida])

  return (
    <div className="nes-screen" style={{
      width: ANCHO_JUEGO,
      height: ALTO_JUEGO,
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* HUD */}
      <HUDDisplay 
        modoJuego={modoJuego}
        jugadorActual={jugadorActual}
        puntuacionJ1={puntuacionJ1}
        puntuacionJ2={puntuacionJ2}
        puntajeMaximo={puntajeMaximo}
        puntajeMaximoPareja={puntajeMaximoPareja}
      />

      {/* VIDAS */}
      {modoJuego === '1P' ? (
        <VidasDisplay vidas={vidasJ1} vidasPerdidas={vidasPerdidasJ1} jugador={1} />
      ) : (
        <>
          <VidasDisplay vidas={vidasJ1} vidasPerdidas={vidasPerdidasJ1} jugador={1} />
          <VidasDisplay vidas={vidasJ2} vidasPerdidas={vidasPerdidasJ2} jugador={2} />
        </>
      )}

      {/* ELEMENTOS DEL JUEGO */}
      <Jugador jugador={estadoVisual.jugador} />

      {estadoVisual.balas.map((b, i) => (
        <Balas key={`bala-${i}`} bala={b} />
      ))}

      {estadoVisual.balasEnemigos.map((b, i) => (
        <Balas key={`bala-enemigo-${i}`} bala={b} />
      ))}

      {estadoVisual.enemigos.map((en, i) => (
        <Enemigo key={`enemigo-${i}`} enemigo={en} />
      ))}

      {/* Controles táctiles */}
      {esMobile && (
        <>
          <JoystickVirtual
            onMover={(x, y, active) => setMovimientoTactil({ x, y, active })}
            style={{ bottom: '60px', left: '20px' }}
          />
          <BotonDisparoVirtual
            onDisparar={(active) => setDisparoTactil(active)}
            style={{ bottom: '60px', right: '20px' }}
          />
        </>
      )}

      {!esMobile && (
        <div className="position-absolute bottom-0 end-0 p-2 text-white" style={{ fontSize: '12px' }}>
          ESC: Pause
        </div>
      )}
    </div>
  )
}

export default MotorJuego