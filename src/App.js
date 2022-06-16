import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import useDeviceAudio from './hooks/useDeviceAudio'

function App() {
  const analyser = useDeviceAudio()
  const audioSpaceRef = useRef()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useLayoutEffect(() => {
    let onResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (analyser) {
      const canvasCtx = audioSpaceRef.current.getContext('2d')

      let onAudio = () => {
        requestAnimationFrame(onAudio)
        const bars = 250
        const barWidth = windowWidth / bars
        const WIDTH = audioSpaceRef.current.width
        const HEIGHT = audioSpaceRef.current.height

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
        canvasCtx.fillStyle = '#707f94'

        for (let i = 0; i < bars; i++) {
          let barPosition = i * barWidth
          let barHeight = -(dataArray[i] / 2)
          canvasCtx.fillRect(barPosition, HEIGHT, barWidth, barHeight)
        }
      }

      onAudio()
    }
  }, [analyser, windowWidth])

  return (
    <div className="App">
      <header className="App-header">Space is only noise if you can see</header>
      <canvas
        ref={audioSpaceRef}
        width={windowWidth}
        id="audio-space"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
        }}
      ></canvas>
    </div>
  )
}

export default App
