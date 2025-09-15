import React from 'react'

function Enemigo({ enemigo }) {
  const rotacion = enemigo.type === 'green' ? enemigo.rotation : 0
  const srcImagen = enemigo.type === 'green'
    ? '/assets/enemigo3.png'
    : '/assets/enemigo2.png'

  return (
    <img
      src={srcImagen}
      alt={enemigo.type}
      className="sprite"
      style={{
        left: enemigo.x,
        top: enemigo.y,
        width: '32px',
        height: '32px',
        transform: `rotate(${rotacion}rad)`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease-out',
        zIndex: 5,
        position: 'absolute',
        imageRendering: 'pixelated'
      }}
    />
  )
}

export default Enemigo