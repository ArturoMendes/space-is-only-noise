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
        const canvasWidth = audioSpaceRef.current.width
        const canvasHeight = audioSpaceRef.current.height
        
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        const barWidth = canvasWidth / bufferLength

        analyser.getByteFrequencyData(dataArray)

        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)
        canvasCtx.fillStyle = '#707f94'

        for (let i = 0; i < bufferLength; i++) {
          let barPosition = i * barWidth
          let barHeight = dataArray[i]
          canvasCtx.fillRect(barPosition, canvasHeight - barHeight/2, barWidth, barHeight)
        }
      }

      onAudio()
    }
  }, [analyser])

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
