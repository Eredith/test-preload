"use client"

import { useState, useEffect } from "react"
import "../styles/RotationOverlay.css"

const RotationOverlay = () => {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    // Check on mount
    checkOrientation()

    // Add event listener for orientation changes
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    // Clean up
    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  if (!isPortrait) return null

  return (
    <div className="rotation-overlay">
      <div className="rotation-content">
        <div className="phone-icon">
          <div className="phone-outline">
            <div className="phone-screen"></div>
          </div>
        </div>
        <h2>Please Rotate Your Device</h2>
        <p>This game is designed to be played in landscape mode.</p>
        <p>Please rotate your device to continue.</p>
      </div>
    </div>
  )
}

export default RotationOverlay
