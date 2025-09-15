import React from 'react'

export default function Player({ player }) {
  return (
    <img
      src="/assets/player.png"
      alt="player"
      className="sprite"
      style={{
        left: player.x,
        top: player.y,
      }}
    />
  )
}
