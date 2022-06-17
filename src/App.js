import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import useDeviceAudio from './hooks/useDeviceAudio'

function App() {
  const analyser = useDeviceAudio()
  const audioSpaceRef = useRef()
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

  useEffect(() => {
    if (analyser) {
      const canvasCtx = audioSpaceRef.current.getContext('2d')

      let onAudio = () => {
        requestAnimationFrame(onAudio)
        const canvasWidth = audioSpaceRef.current.width
        const canvasHeight = audioSpaceRef.current.height

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        let pixelsPerSquare = Math.floor(
          (canvasHeight * canvasWidth) / bufferLength
        )

        const baseSide = Math.sqrt(pixelsPerSquare)

        const rows = Math.floor(canvasHeight / baseSide)
        const rectHeight = canvasHeight / rows

        const columns = Math.floor(bufferLength / rows)
        const rectWidth = canvasWidth / columns

        analyser.getByteFrequencyData(dataArray)

        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)

        // INFO: the loop defines how the frequencies are populated
        let arrayIndex = 0
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            let rectY = i * rectHeight
            let rectX = j * rectWidth

            // TODO: use audioInput value in a better way
            let audioInput = dataArray[arrayIndex]
            
            canvasCtx.fillStyle = `rgba(0, 0, ${audioInput}, ${audioInput ? 1 : 0})`
            canvasCtx.fillRect(rectX, rectY, rectWidth, rectHeight)

            if (process.env.NODE_ENV !== 'production') {
              canvasCtx.textAlign = 'center'
              canvasCtx.fillStyle = `rgb(255, 255, 255, ${audioInput ? 1 : 0})`
              canvasCtx.fillText(
                `${audioInput}`,
                rectX + rectWidth / 2,
                rectY + rectHeight / 2
              )
            }

            arrayIndex++
          }
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
        height={windowHeight}
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
