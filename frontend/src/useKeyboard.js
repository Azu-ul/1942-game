import { useState, useEffect } from 'react'

export default function useKeyboard() {
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
