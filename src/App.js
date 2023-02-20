import { useEffect, useRef } from 'react'
import './App.css'
import VisualizerSpace from './components/VisualizerSpace/VisualizerSpace'
import useDeviceAudio from './hooks/useDeviceAudio'

const colorDict = {}
const redMultiplier = Math.random()
const greenMultiplier = Math.random()
const blueMultiplier = Math.random()

const getColorForFrequency = (frequency) => {
  if (colorDict[frequency] === undefined) {
    let red = (frequency + 1) * redMultiplier
    let green = (frequency + 1) * greenMultiplier
    let blue = (frequency + 1) * blueMultiplier

    colorDict[frequency] = `${red}, ${green}, ${blue}`
  }

  return colorDict[frequency]
}

function App() {
  const analyser = useDeviceAudio()
  const audioSpaceRef = useRef()

  useEffect(() => {
    if (analyser) {
      const canvasCtx = audioSpaceRef.current.getContext('2d')

      let onAudioMakeCircles = () => {
        requestAnimationFrame(onAudioMakeCircles)
        const canvasWidth = audioSpaceRef.current.width
        const canvasHeight = audioSpaceRef.current.height

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        const maxRadius = Math.min(canvasWidth, canvasHeight) / 2
        const centerY = canvasHeight / 2
        const centerX = canvasWidth / 2

        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)

        analyser.getByteFrequencyData(dataArray)

        let frequency = 0
        let radius = 1
        const radiusStep = Math.round(maxRadius / bufferLength) || 1

        // TODO: make it look like disipating circles

        for (let i = 0; i < bufferLength; i++) {
          let decibelValue = dataArray[frequency]

          canvasCtx.beginPath()
          canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
          canvasCtx.lineWidth = 1
          canvasCtx.strokeStyle = `rgba(${getColorForFrequency(frequency)}, ${
            decibelValue / 100
          })`
          canvasCtx.stroke()

          radius += radiusStep
          frequency++
        }
      }

      // let onAudioMakeScreen = () => {
      //   requestAnimationFrame(onAudioMakeScreen)
      //   const canvasWidth = audioSpaceRef.current.width
      //   const canvasHeight = audioSpaceRef.current.height

      //   const bufferLength = analyser.frequencyBinCount
      //   const dataArray = new Uint8Array(bufferLength)

      //   let pixelsPerSquare = Math.floor(
      //     (canvasHeight * canvasWidth) / bufferLength
      //   )

      //   const baseSide = Math.sqrt(pixelsPerSquare)

      //   const rows = Math.floor(canvasHeight / baseSide)
      //   const rectHeight = canvasHeight / rows

      //   const columns = Math.floor(bufferLength / rows)
      //   const rectWidth = canvasWidth / columns

      //   analyser.getByteFrequencyData(dataArray)

      //   canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)

      //   // INFO: the loop defines how the frequencies are populated
      //   let frequency = 0
      //   for (let i = 0; i < rows; i++) {
      //     for (let j = 0; j < columns; j++) {
      //       let rectY = i * rectHeight
      //       let rectX = j * rectWidth

      //       // TODO: use audioInput value in a better way
      //       let decibelValue = dataArray[frequency]

      //       // INFO: creates a grayscale representation
      //       let red = (frequency + 1) * 1
      //       let green = (frequency + 1) * 1
      //       let blue = (frequency + 1) * 1

      //       canvasCtx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${
      //         decibelValue / 100
      //       })`
      //       canvasCtx.fillRect(rectX, rectY, rectWidth, rectHeight)

      //       if (process.env.NODE_ENV !== 'production') {
      //         canvasCtx.textAlign = 'center'
      //         canvasCtx.fillStyle = `rgb(255, 255, 255)`
      //         canvasCtx.fillText(
      //           `${decibelValue}`,
      //           rectX + rectWidth / 2,
      //           rectY + rectHeight / 2
      //         )
      //       }

      //       frequency++
      //     }
      //   }
      // }

      // onAudioMakeScreen()

      onAudioMakeCircles()
    }
  }, [analyser])

  return (
    <div className="App">
      <header className="App-header">Space is only noise if you can see</header>
      <VisualizerSpace ref={audioSpaceRef} />
    </div>
  )
}

export default App
