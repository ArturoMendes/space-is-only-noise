import { forwardRef } from 'react'
import { useState, useLayoutEffect } from 'react'

const VisualizerSpace = forwardRef((props, ref) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useLayoutEffect(() => {
    let onResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <canvas
      ref={ref}
      width={windowWidth}
      height={windowHeight}
      id="audio-space"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
      }}
    ></canvas>
  )
})

export default VisualizerSpace
