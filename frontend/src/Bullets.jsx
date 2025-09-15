import React from 'react'

export default function Bullets({ bullet }) {
  return (
    <img
      src={bullet.sprite}
      alt="bullet"
      className="sprite"
      style={{
        left: bullet.x,
        top: bullet.y,
      }}
    />
  )
}
