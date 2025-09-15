// Enemy.js
import React from 'react'

export default function Enemy({ enemy }) {
  // Aplicar rotación solo para el enemigo verde
  const rotation = enemy.type === 'green' ? enemy.rotation : 0
  
  return (
    <div 
      className="enemy position-absolute" 
      style={{ 
        left: enemy.x, 
        top: enemy.y,
        transform: `rotate(${rotation}rad)`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease-out'
      }}
    >
      <img src={enemy.sprite} alt="enemy" width="40" height="40" />
    </div>
  )
}