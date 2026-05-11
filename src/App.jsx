import { useState, useRef } from 'react'
import './App.css'
import Webcam from 'react-webcam'

function App() {

  const webcamRef = useRef(null)
  const [photo, setPhoto] = useState(null)

  const capture = async () => {
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot()

    setPhoto(imageSrc)
    console.log(imageSrc);
    await fetch('http://localhost:5000', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      image: imageSrc
    })

  })
  }

  return (
    <div>
      <Webcam
        style={{width:'20px', opacity: 0 ,position: 'absolute'}}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={() => {
          console.log("Camera allowed")
        }}

        onUserMediaError={() => {
          alert("Please allow camera permission")
        }}
      />

      <button style={{backgroundColor: 'white', marginTop: '200px', fontSize:'30px', fontWeight: 'bold', width:'200px', padding: '10px', borderRadius: '10px', color:'black', cursor: 'pointer'}} onClick={capture}>
        Start
      </button>

    </div>
  )
}

export default App
