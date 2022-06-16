import { useEffect, useState } from 'react'

const useDeviceAudio = () => {
  const [audioStream, setAudioStream] = useState(null)
  const [analyser, setAnalyser] = useState(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        if (process.env.NODE_ENV !== 'production')
          console.log('Attaching audio stream')
        setAudioStream(stream)
      })
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    if (audioStream) {
      const a = new AudioContext()

      const source = a.createMediaStreamSource(audioStream)
      const analyser = a.createAnalyser()
      source.connect(analyser)

      setAnalyser(analyser)
    }
  }, [audioStream])

  return analyser
}

export default useDeviceAudio
