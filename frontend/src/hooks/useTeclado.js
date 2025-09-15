import { useState, useEffect } from 'react'

function useTeclado() {
  const [teclas, setTeclas] = useState({})

  useEffect(() => {
    const manejarPresionar = e => {
      if (e.code === 'Space') e.preventDefault()
      setTeclas(t => ({ ...t, [e.code]: true }))
    }
    
    const manejarSoltar = e => setTeclas(t => ({ ...t, [e.code]: false }))
    
    window.addEventListener('keydown', manejarPresionar)
    window.addEventListener('keyup', manejarSoltar)
    document.body.style.overflow = 'hidden'
    
    return () => {
      window.removeEventListener('keydown', manejarPresionar)
      window.removeEventListener('keyup', manejarSoltar)
      document.body.style.overflow = 'auto'
    }
  }, [])

  return teclas
}

export default useTeclado