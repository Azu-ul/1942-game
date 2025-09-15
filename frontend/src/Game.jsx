import React, { useState, useEffect, useRef } from 'react'

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

// Componente Player
function Player({ player }) {
  return (
    <div
      className="position-absolute"
      style={{
        left: player.x,
        top: player.y,
        width: '32px',
        height: '32px',
        backgroundColor: '#00ff00',
        borderRadius: '4px',
        zIndex: 10
      }}
    />
  )
}

// Componente Bullets
function Bullets({ bullet }) {
  const isPlayerBullet = bullet.vy < 0
  return (
    <div
      className="position-absolute"
      style={{
        left: bullet.x,
        top: bullet.y,
        width: isPlayerBullet ? '4px' : '8px',
        height: isPlayerBullet ? '12px' : '8px',
        backgroundColor: isPlayerBullet ? '#ffff00' : '#ff0000',
        borderRadius: '2px',
        zIndex: 5
      }}
    />
  )
}

// Componente Enemy
function Enemy({ enemy }) {
  const rotation = enemy.type === 'green' ? enemy.rotation : 0
  return (
    <div
      className="position-absolute"
      style={{
        left: enemy.x,
        top: enemy.y,
        width: '32px',
        height: '32px',
        backgroundColor: enemy.type === 'green' ? '#00ff00' : '#ff6600',
        borderRadius: '4px',
        transform: `rotate(${rotation}rad)`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease-out',
        zIndex: 5
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

// Componente principal del juego
function GameEngine({ onGameOver, onPause, score, setScore, lives, setLives }) {
  const keys = useKeyboard()
  const [player, setPlayer] = useState({ x: GAME_W / 2 - 16, y: GAME_H - 80 })
  const [bullets, setBullets] = useState([])
  const [enemyBullets, setEnemyBullets] = useState([])
  const [enemies, setEnemies] = useState([])
  const [bgOffsetY, setBgOffsetY] = useState(0)

  const bulletsRef = useRef([])
  const enemyBulletsRef = useRef([])
  const enemiesRef = useRef([])
  const bulletCooldownRef = useRef(0)
  const burstTimerRef = useRef(MIN_BURST_INTERVAL + Math.random() * (MAX_BURST_INTERVAL - MIN_BURST_INTERVAL))
  const bgOffsetYRef = useRef(0)

  useEffect(() => {
    if (keys.Escape) {
      onPause()
    }
  }, [keys.Escape, onPause])

  useEffect(() => {
    let last = performance.now()
    let animId

    function loop(now) {
      const dt = (now - last) / 1000
      last = now

      // Mover fondo hacia arriba
      bgOffsetYRef.current += 50 * dt
      if (bgOffsetYRef.current >= BG_IMAGE_HEIGHT) {
        bgOffsetYRef.current = 0
      }
      setBgOffsetY(bgOffsetYRef.current)

      // Mover jugador
      setPlayer(p => {
        let nx = p.x
        let ny = p.y
        if (keys.ArrowLeft) nx -= PLAYER_SPEED * dt
        if (keys.ArrowRight) nx += PLAYER_SPEED * dt
        if (keys.ArrowUp) ny -= PLAYER_SPEED * dt
        if (keys.ArrowDown) ny += PLAYER_SPEED * dt
        nx = Math.max(0, Math.min(GAME_W - 32, nx))
        ny = Math.max(0, Math.min(GAME_H - 32, ny))
        return { ...p, x: nx, y: ny }
      })

      // Disparos jugador
      bulletCooldownRef.current -= dt
      if (keys.Space && bulletCooldownRef.current <= 0) {
        bulletsRef.current.push({
          x: player.x + 12,
          y: player.y - 20,
          vx: 0,
          vy: -BULLET_SPEED
        })
        setBullets([...bulletsRef.current])
        bulletCooldownRef.current = BULLET_COOLDOWN
      }
      bulletsRef.current = bulletsRef.current.map(b => ({
        ...b,
        x: b.x + b.vx * dt,
        y: b.y + b.vy * dt
      })).filter(b => b.y > -20)
      setBullets([...bulletsRef.current])

      // Spawn de ráfagas enemigos normales
      burstTimerRef.current -= dt
      if (burstTimerRef.current <= 0) {
        const burstCount = Math.floor(Math.random() * (MAX_BURST_COUNT - MIN_BURST_COUNT + 1)) + MIN_BURST_COUNT
        for (let i = 0; i < burstCount; i++) {
          const startX = Math.random() * (GAME_W - 32)
          const startY = -32 - Math.random() * 100
          const limitY = GAME_H / 2 + Math.random() * (GAME_H / 2)
          const vx = (Math.random() - 0.5) * 40
          const vy = ENEMY_SPEED + Math.random() * 30
          enemiesRef.current.push({
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
        burstTimerRef.current = MIN_BURST_INTERVAL + Math.random() * (MAX_BURST_INTERVAL - MIN_BURST_INTERVAL)
      }

      // Spawn de enemigos verdes
      if (score > 100 && Math.random() < 0.01 && enemiesRef.current.filter(e => e.type === 'green').length < 2) {
        const fromLeft = Math.random() < 0.5
        const startX = fromLeft ? -32 : GAME_W
        const startY = 100 + Math.random() * (GAME_H - 200)
        const radius = 80 + Math.random() * 70

        enemiesRef.current.push({
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

      // Mover enemigos y disparos
      enemiesRef.current = enemiesRef.current.map(e => {
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
            const xPrev = e.xPrev !== undefined ? e.xPrev : nx;
            const yPrev = e.yPrev !== undefined ? e.yPrev : ny;

            const deltaAngle = e.speed * dt / e.radius;
            angle += deltaAngle;

            const nxNew = e.centerX + Math.cos(angle) * e.radius;
            const nyNew = e.centerY + Math.sin(angle) * e.radius;

            const dx = nxNew - xPrev;
            const dy = nyNew - yPrev;
            rotation = Math.atan2(dy, dx);

            nx = nxNew;
            ny = nyNew;

            if (angle >= 2 * Math.PI) {
              angle -= 2 * Math.PI;
              e.circleCount += 1;
              if (e.circleCount >= 2) state = 'exit';
            }

            e.xPrev = nxNew;
            e.yPrev = nyNew;

            if (fireCooldown <= 0) {
              const dx = (player.x + 14) - (nx + 14)
              const dy = (player.y + 14) - (ny + 14)
              const dist = Math.hypot(dx, dy)
              if (dist > 0) {
                const vxBullet = dx / dist * ENEMY_BULLET_SPEED
                const vyBullet = dy / dist * ENEMY_BULLET_SPEED
                enemyBulletsRef.current.push({
                  x: nx + 12,
                  y: ny + 12,
                  vx: vxBullet,
                  vy: vyBullet
                })
                fireCooldown = 1 + Math.random() * 2
              }
            }
          } else if (state === 'exit') {
            const dir = e.centerX < GAME_W / 2 ? -1 : 1;
            nx += dir * e.speed * dt;
            rotation = dir === -1 ? Math.PI : 0;

            if (nx < -32 || nx > GAME_W) return null;
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
          if (state === 'up' && ny < -32) return null

          if (state === 'down' && fireCooldown <= 0) {
            const dx = (player.x + 14) - (nx + 14)
            const dy = (player.y + 14) - (ny + 14)
            const dist = Math.hypot(dx, dy)
            const vxBullet = dx / dist * ENEMY_BULLET_SPEED
            const vyBullet = dy / dist * ENEMY_BULLET_SPEED
            enemyBulletsRef.current.push({
              x: nx + 12,
              y: ny + 12,
              vx: vxBullet,
              vy: vyBullet
            })
            fireCooldown = 1 + Math.random() * 2
          }
        }

        return { ...e, x: nx, y: ny, vx: nvx, vy: nvy, age, state, slowTimer, fireCooldown, angle, rotation }
      }).filter(Boolean)

      // Mover balas enemigas
      enemyBulletsRef.current = enemyBulletsRef.current.map(b => ({
        ...b,
        x: b.x + b.vx * dt,
        y: b.y + b.vy * dt
      })).filter(b => b.x > 0 && b.x < GAME_W && b.y > 0 && b.y < GAME_H)

      setEnemyBullets([...enemyBulletsRef.current])
      setEnemies([...enemiesRef.current])

      // Separar enemigos normales
      for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < enemiesRef.current.length; i++) {
          for (let j = i + 1; j < enemiesRef.current.length; j++) {
            const e1 = enemiesRef.current[i], e2 = enemiesRef.current[j]
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

      // Colisiones balas/enemigos
      bulletsRef.current.forEach((b, bi) => {
        enemiesRef.current.forEach((en, ei) => {
          if (b.x < en.x + 28 && b.x + 8 > en.x && b.y < en.y + 28 && b.y + 16 > en.y) {
            bulletsRef.current.splice(bi, 1)
            enemiesRef.current.splice(ei, 1)
            setScore(s => s + en.points)
          }
        })
      })

      // Colisiones jugador/balas enemigas
      enemyBulletsRef.current.forEach((b, bi) => {
        if (player.x < b.x + 8 && player.x + 28 > b.x && player.y < b.y + 16 && player.y + 28 > b.y) {
          enemyBulletsRef.current.splice(bi, 1)
          setLives(l => {
            const newLives = l - 1
            if (newLives <= 0) {
              onGameOver()
            }
            return newLives
          })
          // Reset player position
          setPlayer({ x: GAME_W / 2 - 16, y: GAME_H - 80 })
        }
      })

      // Colisiones jugador/enemigos
      enemiesRef.current.forEach((en, ei) => {
        if (
          player.x < en.x + 28 &&
          player.x + 28 > en.x &&
          player.y < en.y + 28 &&
          player.y + 28 > en.y
        ) {
          enemiesRef.current.splice(ei, 1)
          setLives(l => {
            const newLives = l - 1
            if (newLives <= 0) {
              onGameOver()
            }
            return newLives
          })
          // Reset player position
          setPlayer({ x: GAME_W / 2 - 16, y: GAME_H - 80 })
        }
      })

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [keys, player, score, onGameOver, onPause, setScore, setLives])

  return (
    <div className="position-relative" style={{ width: GAME_W, height: GAME_H, overflow: 'hidden' }}>
      {/* FONDO EN MOVIMIENTO */}
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
          backgroundPosition: `0px ${bgOffsetYRef.current}px`,
          zIndex: -1,
        }}
      />

      {/* Estrellas de fondo */}
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
      <Player player={player} />
      {bullets.map((b, i) => <Bullets key={i} bullet={b} />)}
      {enemyBullets.map((b, i) => <Bullets key={i} bullet={b} />)}
      {enemies.map((en, i) => <Enemy key={i} enemy={en} />)}

      {/* HUD */}
      <div className="position-absolute top-0 start-0 p-2 text-white bg-dark bg-opacity-75 rounded-bottom">
        Score: {score}
      </div>
      <div className="position-absolute top-0 end-0 p-2 text-white bg-dark bg-opacity-75 rounded-bottom">
        Lives: {lives}
      </div>
      <div className="position-absolute bottom-0 start-0 p-2 text-white bg-dark bg-opacity-75 rounded-top text-small">
        ESC: Pause
      </div>
    </div>
  )
}

// Pantalla de inicio
function StartScreen({ onStart, onShowRanking }) {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-white"
      style={{ width: GAME_W, height: GAME_H, background: 'linear-gradient(45deg, #001122, #003366)' }}>
      <h1 className="display-2 mb-4 text-warning">1942</h1>
      <div className="text-center mb-4">
        <div className="mb-3">
          <div style={{ width: '60px', height: '60px', backgroundColor: '#00ff00', margin: '0 auto 10px', borderRadius: '8px' }} />
          <small>Tu Avión</small>
        </div>
      </div>

      {!showInstructions ? (
        <div className="text-center">
          <button className="btn btn-success btn-lg mb-3 px-5" onClick={onStart}>
            INICIAR JUEGO
          </button>
          <br />
          <button className="btn btn-info mb-3" onClick={() => setShowInstructions(true)}>
            Instrucciones
          </button>
          <br />
          <button className="btn btn-warning" onClick={onShowRanking}>
            Ranking
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-dark bg-opacity-75 p-4 rounded mb-3">
            <h4>Controles:</h4>
            <p>← → ↑ ↓ : Mover</p>
            <p>ESPACIO : Disparar</p>
            <p>ESC : Pausa</p>
            <hr />
            <h5>Enemigos:</h5>
            <div className="d-flex justify-content-center gap-3 mb-2">
              <div>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#ff6600', margin: '0 auto', borderRadius: '4px' }} />
                <small>Normal: 50pts</small>
              </div>
              <div>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#00ff00', margin: '0 auto', borderRadius: '4px' }} />
                <small>Verde: 100pts</small>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowInstructions(false)}>
            Volver
          </button>
        </div>
      )}
    </div>
  )
}

// Pantalla de pausa
function PauseScreen({ onResume, onQuit, score, lives }) {
  return (
    <div className="position-absolute top-0 start-0 d-flex flex-column align-items-center justify-content-center text-white bg-dark bg-opacity-90"
      style={{ width: GAME_W, height: GAME_H, zIndex: 1000 }}>
      <h2 className="text-warning mb-4">PAUSA</h2>
      <div className="text-center mb-4">
        <p>Score: {score}</p>
        <p>Lives: {lives}</p>
      </div>
      <button className="btn btn-success btn-lg mb-3" onClick={onResume}>
        CONTINUAR
      </button>
      <button className="btn btn-danger" onClick={onQuit}>
        SALIR
      </button>
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
    <div
      className="d-flex flex-column align-items-center justify-content-center text-white"
      style={{
        width: GAME_W,
        height: GAME_H,
        background: 'linear-gradient(45deg, #220011, #660033)',
      }}
    >
      <h1 className="display-3 text-danger mb-4">GAME OVER</h1>
      <h2 className="text-warning mb-4">Score Final: {score}</h2>

      {/* Mostrar input de iniciales si entra en el ranking y todavía no guardó */}
      {rank && rank <= 10 && !scoreSaved && (
        <div className="text-center mb-4">
          <h4 className="text-success">¡Nuevo High Score!</h4>
          <p>Ingresa tus iniciales:</p>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              className="form-control text-center"
              style={{ width: '80px', textTransform: 'uppercase' }}
              maxLength={3}
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && !saving && handleSaveScore()}
              autoFocus
              disabled={saving}
            />
            <button
              className="btn btn-primary"
              onClick={handleSaveScore}
              disabled={initials.length !== 3 || saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Mostrar botones SOLO después de guardar o si no es high score */}
      {(scoreSaved || !rank || rank > 10) && (
        <div className="text-center mt-4">
          {scoreSaved && (
            <div className="mb-2">
              <h5 className="text-info">¡Score guardado con éxito, {initials}!</h5>
            </div>
          )}
          <button className="btn btn-success btn-lg mb-3" onClick={onRestart}>
            JUGAR DE NUEVO
          </button>
          <br />
          <button className="btn btn-secondary" onClick={onMainMenu}>
            MENÚ PRINCIPAL
          </button>
        </div>
      )}

    </div>
  )
}


// Pantalla de Ranking
function RankingScreen({ onBack, scores, isLoading, error }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-white p-4"
      style={{ width: GAME_W, height: GAME_H, background: 'linear-gradient(45deg, #001122, #003366)' }}>
      <h1 className="text-warning mb-4">RANKING</h1>

      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando rankings...</p>
        </div>
      ) : error ? (
        <div className="text-center text-danger mb-4">
          <p>Error al cargar los rankings:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="w-100">
          {scores.length > 0 ? (
            <div className="bg-dark bg-opacity-75 p-3 rounded">
              {scores.map((score, index) => (
                <div key={score.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                  <span className="text-warning fw-bold">#{index + 1}</span>
                  <span className="text-info fw-bold">{score.initials}</span>
                  <span className="text-success fw-bold">{score.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No hay scores registrados aún.</p>
          )}
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={onBack}>
        VOLVER
      </button>
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
      // Fallback a datos vacíos en caso de error
      setHighScores([])
    } finally {
      setIsLoadingScores(false)
    }
  }

  // Guardar score en la base de datos
  const saveScore = async (initials, playerScore) => {
    try {
      const result = await scoresAPI.create(initials, playerScore)
      // Recargar los scores después de guardar
      await loadHighScores()

      // Mostrar mensaje apropiado según la respuesta del servidor
      if (result.updated) {
        console.log(`Score actualizado para ${initials}: ${playerScore}`)
      } else if (result.inserted) {
        console.log(`Nuevo score guardado para ${initials}: ${playerScore}`)
      } else if (result.kept_existing) {
        console.log(`Score existente para ${initials} era mejor`)
      }
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

  // Verificar si el score actual es un high score
  const isHighScore = () => {
    // Si hay menos de 10 scores, siempre es high score
    if (highScores.length < 10) return true

    // Verificar si el score es mayor que el último del top 10
    const worstScore = highScores[highScores.length - 1]?.score || 0
    if (score > worstScore) return true

    // Verificar si ya existe un record con mejores iniciales y este score es mejor
    // Esto se manejará mejor en el servidor, pero por ahora mantenemos la lógica simple
    return false
  }

  const getScoreRank = () => {
    const tempScores = [...highScores, { initials: 'YOU', score }]
      .sort((a, b) => b.score - a.score)   // ordenar de mayor a menor
      .slice(0, 10)                        // quedarse con top 10
    const index = tempScores.findIndex(s => s.score === score)
    return index === -1 ? null : index + 1 // devuelve 1..10 si estás en top 10, o null si no
  }


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
      <div className="border border-light position-relative" style={{ width: GAME_W, height: GAME_H }}>
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
          <div>
            <GameEngine
              onGameOver={gameOver}
              onPause={pauseGame}
              score={score}
              setScore={setScore}
              lives={lives}
              setLives={setLives}
            />
            <PauseScreen
              onResume={resumeGame}
              onQuit={quitToMainMenu}
              score={score}
              lives={lives}
            />
          </div>
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