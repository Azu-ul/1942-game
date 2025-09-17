import React, { useState, useEffect } from 'react'

function OrientationNotice() {
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth
      const isSmallScreen = window.innerWidth <= 480
      setShowNotice(isPortrait && isSmallScreen)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  if (!showNotice) return null

  return (
    <div className="orientation-notice">
      <h2>🔄 ROTATE DEVICE</h2>
      <p>This game is optimized for landscape mode.</p>
      <p>Please rotate your device to continue playing.</p>
      <div style={{ 
        fontSize: '3em', 
        margin: '20px 0',
        animation: 'spin 2s linear infinite' 
      }}>
        📱➡️📱
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  )
}

export default OrientationNotice