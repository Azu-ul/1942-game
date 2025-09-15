import React, { useState, useEffect, useRef, useCallback } from 'react'

// Hook personalizado para el teclado
function useKeyboard() {
  const [keys, setKeys] = useState({})

  useEffect(() => {
    const handleDown = e => {
      if (e.code === 'Space') e.preventDefault()
      setKeys(k => ({ ...k, [e.code]: true }))
    }
    const handleUp = e => setKeys(k => ({ ...k, [e.code]: false }))
    window.addEventListener('keydown', handleDown)
    window.addEventListener('keyup', handleUp)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
      document.body.style.overflow = 'auto'
    }
  }, [])

  return keys
}

// Componente Player — AHORA CON IMAGEN
function Player({ player }) {
  return (
    <img
      src="/assets/avion_recto.png"
      alt="Player"
      className="sprite"
      style={{
        left: player.x,
        top: player.y,
        width: '32px',
        height: '32px',
        zIndex: 10,
        position: 'absolute',
        imageRendering: 'pixelated'
      }}
    />
  )
}

// Componente Bullets — AHORA CON IMAGEN para balas del jugador
function Bullets({ bullet }) {
  const isPlayerBullet = bullet.vy < 0
  if (isPlayerBullet) {
    return (
      <img
        src="/assets/bala2.png"
        alt="Player Bullet"
        className="sprite"
        style={{
          left: bullet.x,
          top: bullet.y,
          width: '8px',
          height: '16px',
          zIndex: 5,
          position: 'absolute',
          imageRendering: 'pixelated'
        }}
      />
    )
  } else {
    // Balas enemigas se mantienen como círculos rojos (puedes reemplazar después)
    return (
      <div
        className="position-absolute"
        style={{
          left: bullet.x,
          top: bullet.y,
          width: '8px',
          height: '8px',
          backgroundColor: '#ff0000',
          borderRadius: '50%',
          zIndex: 5
        }}
      />
    )
  }
}

// Componente Enemy — AHORA CON IMAGEN según tipo
function Enemy({ enemy }) {
  const rotation = enemy.type === 'green' ? enemy.rotation : 0
  const imgSrc = enemy.type === 'green'
    ? '/assets/enemigo3.png'
    : '/assets/enemigo2.png'

  return (
    <img
      src={imgSrc}
      alt={enemy.type}
      className="sprite"
      style={{
        left: enemy.x,
        top: enemy.y,
        width: '32px',
        height: '32px',
        transform: `rotate(${rotation}rad)`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease-out',
        zIndex: 5,
        position: 'absolute',
        imageRendering: 'pixelated'
      }}
    />
  )
}

// Constantes del juego
const GAME_W = 650
const GAME_H = 650
const PLAYER_SPEED = 300
const BULLET_SPEED = 1000
const ENEMY_BULLET_SPEED = 400
const BULLET_COOLDOWN = 0.10
const MIN_BURST_INTERVAL = 4
const MAX_BURST_INTERVAL = 5
const MIN_BURST_COUNT = 3
const MAX_BURST_COUNT = 5
const ENEMY_SPEED = 120
const GREEN_ENEMY_SPEED = 300
const SLOW_DURATION = 1
const BG_IMAGE_HEIGHT = 2164

// Configuración de la API
const API_BASE_URL = 'http://localhost:4000'

// Componente de Joystick Virtual
function VirtualJoystick({ onMove, onShoot, style }) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const joystickRef = useRef(null)
  const containerRef = useRef(null)

  const handleStart = (clientX, clientY) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = clientX - rect.left - centerX
    const y = clientY - rect.top - centerY
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = centerX * 0.6

    if (distance > maxDistance) {
      const angle = Math.atan2(y, x)
      setPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      })
    } else {
      setPosition({ x, y })
    }

    setIsDragging(true)
    onMove(x, y, distance > 5)
  }

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = clientX - rect.left - centerX
    const y = clientY - rect.top - centerY
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = centerX * 0.6

    if (distance > maxDistance) {
      const angle = Math.atan2(y, x)
      setPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      })
    } else {
      setPosition({ x, y })
    }

    onMove(x, y, distance > 5)
  }

  const handleEnd = () => {
    if (isDragging) {
      setPosition({ x: 0, y: 0 })
      setIsDragging(false)
      onMove(0, 0, false)
    }
  }

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0]
        handleMove(touch.clientX, touch.clientY)
      }
    }

    const handleTouchEnd = () => handleEnd()

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)
      window.addEventListener('mouseup', handleEnd)
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('mouseup', handleEnd)
    }
  }, [isDragging])

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
      onTouchStart={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        handleStart(touch.clientX, touch.clientY)
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        handleStart(e.clientX, e.clientY)
      }}
    >
      <div
        ref={joystickRef}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      />
    </div>
  )
}

// Componente Botón de Disparo Virtual
function VirtualShootButton({ onShoot, style }) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      style={{
        position: 'absolute',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: isPressed ? 'rgba(255,255,0,0.7)' : 'rgba(255,255,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        color: 'white',
        WebkitTapHighlightColor: 'transparent',
        ...style
      }}
      onTouchStart={(e) => {
        e.preventDefault()
        setIsPressed(true)
        onShoot(true)
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        setIsPressed(false)
        onShoot(false)
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        setIsPressed(true)
        onShoot(true)
      }}
      onMouseUp={(e) => {
        e.preventDefault()
        setIsPressed(false)
        onShoot(false)
      }}
      onMouseLeave={(e) => {
        if (isPressed) {
          setIsPressed(false)
          onShoot(false)
        }
      }}
    >
      🔫
    </div>
  )
}

// Componente principal del juego
// Componente principal del juego — OPTIMIZADO
function GameEngine({ onGameOver, onPause, score, setScore, lives, setLives }) {
  const keys = useKeyboard()
  const gameContainerRef = useRef(null)

  // Estados visuales (solo se actualizan cuando cambian para render)
  const [visualState, setVisualState] = useState({
    player: { x: GAME_W / 2 - 16, y: GAME_H - 80 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    bgOffsetY: 0
  })

  // Refs para lógica interna (no disparan re-render)
  const gameStateRef = useRef({
    player: { x: GAME_W / 2 - 16, y: GAME_H - 80 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    bgOffsetY: 0,
    lastTime: 0,
    bulletCooldown: 0,
    burstTimer: MIN_BURST_INTERVAL + Math.random() * (MAX_BURST_INTERVAL - MIN_BURST_INTERVAL)
  })

  // Controles táctiles
  const [touchMove, setTouchMove] = useState({ x: 0, y: 0, active: false })
  const [touchShoot, setTouchShoot] = useState(false)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Solo actualizar estado visual cuando cambien los elementos (evita re-render innecesarios)
  const updateVisualState = useCallback(() => {
    const gs = gameStateRef.current
    setVisualState({
      player: { ...gs.player },
      bullets: [...gs.bullets],
      enemyBullets: [...gs.enemyBullets],
      enemies: [...gs.enemies],
      bgOffsetY: gs.bgOffsetY
    })
  }, [])

  useEffect(() => {
    if (keys.Escape) {
      onPause()
    }
  }, [keys.Escape, onPause])

  useEffect(() => {
    let animId
    let lastTime = performance.now()

    const gameLoop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000
      lastTime = currentTime

      const gs = gameStateRef.current
      gs.lastTime = currentTime

      // Mover fondo
      gs.bgOffsetY += 50 * dt
      if (gs.bgOffsetY >= BG_IMAGE_HEIGHT) {
        gs.bgOffsetY = 0
      }

      // Mover jugador
      let nx = gs.player.x
      let ny = gs.player.y

      if (keys.ArrowLeft) nx -= PLAYER_SPEED * dt
      if (keys.ArrowRight) nx += PLAYER_SPEED * dt
      if (keys.ArrowUp) ny -= PLAYER_SPEED * dt
      if (keys.ArrowDown) ny += PLAYER_SPEED * dt

      if (touchMove.active) {
        const moveSpeed = PLAYER_SPEED * dt
        if (touchMove.x < -10) nx -= moveSpeed
        if (touchMove.x > 10) nx += moveSpeed
        if (touchMove.y < -10) ny -= moveSpeed
        if (touchMove.y > 10) ny += moveSpeed
      }

      nx = Math.max(0, Math.min(GAME_W - 32, nx))
      ny = Math.max(0, Math.min(GAME_H - 32, ny))
      gs.player = { x: nx, y: ny }

      // Disparos jugador
      gs.bulletCooldown -= dt
      const isShooting = keys.Space || touchShoot
      if (isShooting && gs.bulletCooldown <= 0) {
        gs.bullets.push({
          x: gs.player.x + 12,
          y: gs.player.y - 20,
          vx: 0,
          vy: -BULLET_SPEED
        })
        gs.bulletCooldown = BULLET_COOLDOWN
      }

      // Actualizar balas
      gs.bullets = gs.bullets.map(b => ({
        ...b,
        x: b.x + b.vx * dt,
        y: b.y + b.vy * dt
      })).filter(b => b.y > -20)

      // Spawn enemigos
      gs.burstTimer -= dt
      if (gs.burstTimer <= 0) {
        const burstCount = Math.floor(Math.random() * (MAX_BURST_COUNT - MIN_BURST_COUNT + 1)) + MIN_BURST_COUNT
        for (let i = 0; i < burstCount; i++) {
          const startX = Math.random() * (GAME_W - 32)
          const startY = -32 - Math.random() * 100
          const limitY = GAME_H / 2 + Math.random() * (GAME_H / 2)
          const vx = (Math.random() - 0.5) * 40
          const vy = ENEMY_SPEED + Math.random() * 30
          gs.enemies.push({
            x: startX,
            y: startY,
            vx,
            vy,
            state: 'down',
            limitY,
            age: 0,
            type: Math.random() < 0.5 ? 'sine' : 'zigzag',
            slowTimer: 0,
            fireCooldown: 1 + Math.random() * 2,
            points: 50
          })
        }
        gs.burstTimer = MIN_BURST_INTERVAL + Math.random() * (MAX_BURST_INTERVAL - MIN_BURST_INTERVAL)
      }

      // Spawn enemigos verdes
      if (score > 100 && Math.random() < 0.01 && gs.enemies.filter(e => e.type === 'green').length < 2) {
        const fromLeft = Math.random() < 0.5
        const startX = fromLeft ? -32 : GAME_W
        const startY = 100 + Math.random() * (GAME_H - 200)
        const radius = 80 + Math.random() * 70

        gs.enemies.push({
          type: 'green',
          x: startX,
          y: startY,
          centerX: startX + (fromLeft ? radius : -radius),
          centerY: startY,
          angle: fromLeft ? Math.PI : 0,
          radius,
          speed: GREEN_ENEMY_SPEED,
          circleCount: 0,
          points: 100,
          rotation: fromLeft ? Math.PI : 0,
          xPrev: startX,
          yPrev: startY,
          state: 'circle',
          fireCooldown: 1 + Math.random() * 2,
        })
      }

      // Mover enemigos
      for (let i = gs.enemies.length - 1; i >= 0; i--) {
        const e = gs.enemies[i]
        let nx = e.x
        let ny = e.y
        let nvx = e.vx
        let nvy = e.vy
        let age = e.age + dt
        let state = e.state
        let slowTimer = e.slowTimer
        let fireCooldown = e.fireCooldown - dt
        let angle = e.angle || 0
        let rotation = e.rotation || 0

        if (e.type === 'green') {
          if (state === 'circle') {
            const xPrev = e.xPrev !== undefined ? e.xPrev : nx
            const yPrev = e.yPrev !== undefined ? e.yPrev : ny

            const deltaAngle = e.speed * dt / e.radius
            angle += deltaAngle

            const nxNew = e.centerX + Math.cos(angle) * e.radius
            const nyNew = e.centerY + Math.sin(angle) * e.radius

            const dx = nxNew - xPrev
            const dy = nyNew - yPrev
            rotation = Math.atan2(dy, dx)

            nx = nxNew
            ny = nyNew

            if (angle >= 2 * Math.PI) {
              angle -= 2 * Math.PI
              e.circleCount += 1
              if (e.circleCount >= 2) state = 'exit'
            }

            e.xPrev = nxNew
            e.yPrev = nyNew

            if (fireCooldown <= 0) {
              const dx = (gs.player.x + 14) - (nx + 14)
              const dy = (gs.player.y + 14) - (ny + 14)
              const dist = Math.hypot(dx, dy)
              if (dist > 0) {
                const vxBullet = dx / dist * ENEMY_BULLET_SPEED
                const vyBullet = dy / dist * ENEMY_BULLET_SPEED
                gs.enemyBullets.push({
                  x: nx + 12,
                  y: ny + 12,
                  vx: vxBullet,
                  vy: vyBullet
                })
                fireCooldown = 1 + Math.random() * 2
              }
            }
          } else if (state === 'exit') {
            const dir = e.centerX < GAME_W / 2 ? -1 : 1
            nx += dir * e.speed * dt
            rotation = dir === -1 ? Math.PI : 0

            if (nx < -32 || nx > GAME_W) {
              gs.enemies.splice(i, 1)
              continue
            }
          }
        } else {
          nx += nvx * dt
          ny += nvy * dt
          if (e.type === 'sine') nx += Math.sin(age * 3) * 20 * dt
          else if (e.type === 'zigzag') nx += Math.sin(age * 5) * 30 * dt

          if (state === 'down' && ny >= e.limitY && slowTimer <= 0) {
            slowTimer = SLOW_DURATION
            nvy = nvy * 0.4
          }
          if (slowTimer > 0) {
            slowTimer -= dt
            if (slowTimer <= 0) {
              nvy = -ENEMY_SPEED
              state = 'up'
            }
          }
          if (state === 'up' && ny < -32) {
            gs.enemies.splice(i, 1)
            continue
          }

          if (state === 'down' && fireCooldown <= 0) {
            const dx = (gs.player.x + 14) - (nx + 14)
            const dy = (gs.player.y + 14) - (ny + 14)
            const dist = Math.hypot(dx, dy)
            const vxBullet = dx / dist * ENEMY_BULLET_SPEED
            const vyBullet = dy / dist * ENEMY_BULLET_SPEED
            gs.enemyBullets.push({
              x: nx + 12,
              y: ny + 12,
              vx: vxBullet,
              vy: vyBullet
            })
            fireCooldown = 1 + Math.random() * 2
          }
        }

        // Actualizar enemigo
        Object.assign(e, {
          x: nx, y: ny, vx: nvx, vy: nvy, age, state, slowTimer, fireCooldown, angle, rotation
        })
      }

      // Mover balas enemigas
      gs.enemyBullets = gs.enemyBullets.map(b => ({
        ...b,
        x: b.x + b.vx * dt,
        y: b.y + b.vy * dt
      })).filter(b => b.x > 0 && b.x < GAME_W && b.y > 0 && b.y < GAME_H)

      // Separar enemigos normales
      for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < gs.enemies.length; i++) {
          for (let j = i + 1; j < gs.enemies.length; j++) {
            const e1 = gs.enemies[i], e2 = gs.enemies[j]
            if (e1.type === 'green' || e2.type === 'green') continue
            const dx = e2.x - e1.x, dy = e2.y - e1.y, dist = Math.hypot(dx, dy)
            if (dist < 30 && dist > 0) {
              const push = (30 - dist) / 2, nx = dx / dist, ny = dy / dist
              e1.x -= nx * push; e1.y -= ny * push
              e2.x += nx * push; e2.y += ny * push
            }
          }
        }
      }

      // Colisiones balas jugador / enemigos
      for (let bi = gs.bullets.length - 1; bi >= 0; bi--) {
        const b = gs.bullets[bi]
        for (let ei = gs.enemies.length - 1; ei >= 0; ei--) {
          const en = gs.enemies[ei]
          if (b.x < en.x + 28 && b.x + 8 > en.x && b.y < en.y + 28 && b.y + 16 > en.y) {
            gs.bullets.splice(bi, 1)
            gs.enemies.splice(ei, 1)
            setScore(prev => prev + en.points)
            break
          }
        }
      }

      // Colisiones balas enemigas / jugador
      for (let bi = gs.enemyBullets.length - 1; bi >= 0; bi--) {
        const b = gs.enemyBullets[bi]
        const p = gs.player
        if (p.x < b.x + 8 && p.x + 28 > b.x && p.y < b.y + 16 && p.y + 28 > b.y) {
          gs.enemyBullets.splice(bi, 1)
          setLives(prev => {
            const newLives = prev - 1
            if (newLives <= 0) {
              onGameOver()
            }
            return newLives
          })
          gs.player = { x: GAME_W / 2 - 16, y: GAME_H - 80 }
          break
        }
      }

      // Colisiones enemigos / jugador
      for (let ei = gs.enemies.length - 1; ei >= 0; ei--) {
        const en = gs.enemies[ei]
        const p = gs.player
        if (p.x < en.x + 28 && p.x + 28 > en.x && p.y < en.y + 28 && p.y + 28 > en.y) {
          gs.enemies.splice(ei, 1)
          setLives(prev => {
            const newLives = prev - 1
            if (newLives <= 0) {
              onGameOver()
            }
            return newLives
          })
          gs.player = { x: GAME_W / 2 - 16, y: GAME_H - 80 }
          break
        }
      }

      // Actualizar estado visual (solo si cambió algo importante)
      updateVisualState()

      animId = requestAnimationFrame(gameLoop)
    }

    animId = requestAnimationFrame(gameLoop)

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [keys, touchMove, touchShoot, score, onGameOver, onPause, setScore, setLives, updateVisualState])

  return (
    <div className="nes-screen" style={{ width: GAME_W, height: GAME_H, overflow: 'hidden', position: 'relative' }}>
      {/* FONDO */}
      <div
        className="position-absolute"
        style={{
          top: 0,
          left: 0,
          width: GAME_W,
          height: GAME_H * 2,
          background: 'linear-gradient(180deg, #001122 0%, #003366 50%, #001122 100%)',
          backgroundSize: `${GAME_W}px auto`,
          backgroundRepeat: 'repeat-y',
          backgroundPosition: `0px ${visualState.bgOffsetY}px`,
          zIndex: -1,
        }}
      />

      {/* Estrellas */}
      <div
        className="position-absolute"
        style={{
          top: 0,
          left: 0,
          width: GAME_W,
          height: GAME_H,
          background: `radial-gradient(circle at 10% 20%, white 1px, transparent 1px),
                      radial-gradient(circle at 80% 80%, white 1px, transparent 1px),
                      radial-gradient(circle at 40% 40%, white 1px, transparent 1px),
                      radial-gradient(circle at 90% 10%, white 1px, transparent 1px),
                      radial-gradient(circle at 20% 90%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 150px 150px, 200px 200px, 80px 80px, 120px 120px',
          zIndex: 0,
        }}
      />

      {/* ELEMENTOS DEL JUEGO */}
      <Player player={visualState.player} />
      {visualState.bullets.map((b, i) => <Bullets key={i} bullet={b} />)}
      {visualState.enemyBullets.map((b, i) => <Bullets key={i} bullet={b} />)}
      {visualState.enemies.map((en, i) => <Enemy key={i} enemy={en} />)}

      {/* Controles táctiles */}
      {isMobile && (
        <>
          <VirtualJoystick
            onMove={(x, y, active) => setTouchMove({ x, y, active })}
            onShoot={() => { }}
            style={{ bottom: '20px', left: '20px' }}
          />
          <VirtualShootButton
            onShoot={(active) => setTouchShoot(active)}
            style={{ bottom: '20px', right: '20px' }}
          />
        </>
      )}

      {/* HUD */}
      <div className="position-absolute top-0 start-0 p-2 text-white" style={{ fontSize: '16px' }}>
        Score: {score}
      </div>
      <div className="position-absolute top-0 end-0 p-2 text-white" style={{ fontSize: '16px' }}>
        Lives: {lives}
      </div>
      {!isMobile && (
        <div className="position-absolute bottom-0 start-0 p-2 text-white text-small">
          ESC: Pause
        </div>
      )}
    </div>
  )
}

// Pantalla de inicio
function StartScreen({ onStart, onShowRanking }) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [hiScore, setHiScore] = useState(0)

  useEffect(() => {
    const loadHiScore = async () => {
      try {
        const scores = await scoresAPI.getAll()
        if (scores.length > 0) {
          setHiScore(scores[0].score)
        }
      } catch (e) {
        console.error("No se pudo cargar HI SCORE")
      }
    }
    loadHiScore()
  }, [])

  if (showInstructions) {
    return (
      <div className="nes-screen" style={{ width: GAME_W, height: GAME_H }}>
        <div className="text-center text-white p-3" style={{ fontSize: '16px' }}>
          <h4>CONTROLES</h4>
          <p>← → ↑ ↓ : MOVER</p>
          <p>ESPACIO : DISPARAR</p>
          <p>ESC : PAUSA</p>
          <hr style={{ borderColor: 'white' }} />
          <h5>ENEMIGOS</h5>
          <p>NORMAL: 50 PTS</p>
          <p>VERDE: 100 PTS</p>
          <div className="mt-4" onClick={() => setShowInstructions(false)} style={{ cursor: 'pointer', fontSize: '20px' }}>
            [ Volver ]
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nes-screen" style={{ width: GAME_W, height: GAME_H, position: 'relative' }}>
      {/* HI SCORE arriba a la derecha */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        textAlign: 'right',
        color: 'white',
        fontSize: '16px'
      }}>
        <div>HI SCORE</div>
        <div>{hiScore.toLocaleString()}</div>
      </div>

      {/* Título centrado arriba */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <img
          src="/assets/screens/titulo_1942.png"
          alt="1942"
          style={{
            height: '120px',
            imageRendering: 'pixelated'
          }}
        />
      </div>

      {/* Opciones centradas abajo del título */}
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer'
      }}>
        <div onClick={onStart} style={{ marginBottom: '20px' }}>1 PLAYER</div>
        <div onClick={() => setShowInstructions(true)} style={{ marginBottom: '20px' }}>INSTRUCCIONES</div>
        <div onClick={onShowRanking}>RANKING</div>
      </div>
    </div>
  )
}

// Pantalla de pausa
function PauseScreen({ onResume, onQuit, score, lives }) {
  return (
    <div className="nes-screen" style={{ width: GAME_W, height: GAME_H, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 className="text-white">PAUSA</h2>
      <p className="text-white">SCORE: {score}</p>
      <p className="text-white">LIVES: {lives}</p>
      <div onClick={onResume} style={{ cursor: 'pointer', margin: '10px 0', fontSize: '20px' }}>[ CONTINUAR ]</div>
      <div onClick={onQuit} style={{ cursor: 'pointer', fontSize: '20px' }}>[ SALIR ]</div>
    </div>
  )
}

// Pantalla de Game Over
function GameOverScreen({ score, onRestart, onMainMenu, onSaveScore, rank }) {
  const [initials, setInitials] = useState('')
  const [scoreSaved, setScoreSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSaveScore = async () => {
    if (initials.length === 3) {
      setSaving(true)
      try {
        await onSaveScore(initials, score)
        setScoreSaved(true)
      } catch (error) {
        console.error('Error saving score:', error)
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <div className="nes-screen" style={{ width: GAME_W, height: GAME_H }}>
      <div className="text-center text-white" style={{ padding: '20px', fontSize: '24px' }}>
        <h1>GAME OVER</h1>
        <h2>SCORE FINAL: {score}</h2>

        {rank && rank <= 10 && !scoreSaved && (
          <div className="text-center mt-4">
            <h4 className="text-success">¡Nuevo High Score!</h4>
            <p>Ingresa tus iniciales:</p>
            <div className="d-flex align-items-center gap-2 justify-content-center mb-3">
              <input
                type="text"
                className="form-control text-center"
                style={{ width: '80px', textTransform: 'uppercase', backgroundColor: 'black', color: 'white', border: '1px solid white' }}
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && !saving && handleSaveScore()}
                autoFocus
                disabled={saving}
              />
              <button
                className="btn"
                style={{ backgroundColor: 'white', color: 'black' }}
                onClick={handleSaveScore}
                disabled={initials.length !== 3 || saving}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        {(scoreSaved || !rank || rank > 10) && (
          <div className="text-center mt-4">
            {scoreSaved && (
              <div className="mb-2">
                <h5 className="text-info">¡Score guardado con éxito, {initials}!</h5>
              </div>
            )}
            <div onClick={onRestart} style={{ cursor: 'pointer', margin: '10px 0', fontSize: '20px' }}>[ JUGAR DE NUEVO ]</div>
            <div onClick={onMainMenu} style={{ cursor: 'pointer', fontSize: '20px' }}>[ MENÚ PRINCIPAL ]</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Pantalla de Ranking
function RankingScreen({ onBack, scores, isLoading, error }) {
  return (
    <div className="nes-screen" style={{ width: GAME_W, height: GAME_H, padding: '20px' }}>
      <h1 className="text-center text-white">RANKING</h1>

      {isLoading ? (
        <div className="text-center text-white">
          <p>Cargando rankings...</p>
        </div>
      ) : error ? (
        <div className="text-center text-danger">
          <p>Error al cargar los rankings</p>
        </div>
      ) : (
        <div>
          {scores.length > 0 ? (
            <div>
              {scores.slice(0, 10).map((score, index) => (
                <div key={score.id} className="d-flex justify-content-between align-items-center mb-2 p-2" style={{ color: 'white' }}>
                  <span>#{index + 1}</span>
                  <span>{score.initials}</span>
                  <span>{score.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white">No hay scores registrados aún.</p>
          )}
        </div>
      )}

      <div className="text-center mt-4" onClick={onBack} style={{ cursor: 'pointer', fontSize: '20px' }}>
        [ VOLVER ]
      </div>
    </div>
  )
}

// Funciones para la API
const scoresAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/scores`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching scores:', error)
      throw error
    }
  },

  async create(initials, score) {
    try {
      const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initials, score }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error saving score:', error)
      throw error
    }
  }
}

// Componente principal del juego completo
export default function Complete1942Game() {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'paused', 'gameOver', 'ranking'
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScores, setHighScores] = useState([])
  const [isLoadingScores, setIsLoadingScores] = useState(false)
  const [scoresError, setScoresError] = useState(null)

  // Manejo global del botón de pausa con ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        e.preventDefault()
        if (gameState === 'playing') setGameState('paused')
        else if (gameState === 'paused') setGameState('playing')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  // Cargar scores desde la base de datos
  const loadHighScores = async () => {
    setIsLoadingScores(true)
    setScoresError(null)
    try {
      const scores = await scoresAPI.getAll()
      setHighScores(scores)
    } catch (error) {
      console.error('Error loading scores:', error)
      setScoresError(error.message)
      setHighScores([])
    } finally {
      setIsLoadingScores(false)
    }
  }

  // Guardar score en la base de datos
  const saveScore = async (initials, playerScore) => {
    try {
      const result = await scoresAPI.create(initials, playerScore)
      await loadHighScores()
    } catch (error) {
      console.error('Error saving score:', error)
      throw error
    }
  }

  const startGame = () => {
    setScore(0)
    setLives(3)
    setGameState('playing')
  }

  const pauseGame = () => setGameState('paused')
  const resumeGame = () => setGameState('playing')
  const gameOver = () => setGameState('gameOver')
  const quitToMainMenu = () => setGameState('start')
  const showRanking = () => {
    loadHighScores()
    setGameState('ranking')
  }

  const getScoreRank = () => {
    const tempScores = [...highScores, { initials: 'YOU', score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    const index = tempScores.findIndex(s => s.score === score)
    return index === -1 ? null : index + 1
  }

  return (
    <div className="game-container">
      <div className="game-wrapper">
        {gameState === 'start' && (
          <StartScreen onStart={startGame} onShowRanking={showRanking} />
        )}

        {gameState === 'playing' && (
          <GameEngine
            onGameOver={gameOver}
            onPause={pauseGame}
            score={score}
            setScore={setScore}
            lives={lives}
            setLives={setLives}
          />
        )}

        {gameState === 'paused' && (
          <>
            <PauseScreen
              onResume={resumeGame}
              onQuit={quitToMainMenu}
              score={score}
              lives={lives}
            />
          </>
        )}

        {gameState === 'gameOver' && (
          <GameOverScreen
            score={score}
            onRestart={startGame}
            onMainMenu={quitToMainMenu}
            onSaveScore={saveScore}
            rank={getScoreRank()}
          />
        )}

        {gameState === 'ranking' && (
          <RankingScreen
            onBack={quitToMainMenu}
            scores={highScores}
            isLoading={isLoadingScores}
            error={scoresError}
          />
        )}
      </div>
    </div>
  )
}
