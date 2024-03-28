import React, { useRef, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [predictedClass, setPredictedClass] = useState(null);
  const [historyText, setHistoryText] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const takePhoto = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataURL = canvas.toDataURL('image/jpeg');

    const blob = await (await fetch(dataURL)).blob();

    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setPredictedClass(data.predicted_class);
      if (data.history_text) {
        setHistoryText(data.history_text);
      } else {
        setHistoryText(null);
      }
      console.log(data);
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };

  return (
    <>
      <div className='bg-[#181818] h-[689px]'>
        <div className='flex flex-col justify-center'>
          <h1 className='text-center text-white font-semibold text-6xl mt-6'>FLAG DETECTOR</h1>

          <div className='flex justify-center'>
            {!cameraActive && (
              <button className='p-3 mt-6 text-white font-semibold bg-[#474747] rounded-lg hover:bg-[#3e3e3e]' onClick={startCamera}>Activar Cámara</button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 mt-9'>
          <div>
            <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '640px', display: cameraActive ? 'block' : 'none' }} className='ml-5 rounded-3xl'></video>
            <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" className='ml-10'></canvas>
          </div>


          {cameraActive && (
            <div className='mx-20 ml-[15px] bg-[#2c2c2c] rounded-3xl p-5'>

              {!historyText && (
                <h1 className='text-[#d75858] text-6xl font-semibold text-center mt-[155px]'>ESPERANDO BANDERA</h1>
              )}
              <h1 className='text-[#d75858] text-8xl font-semibold mb-8 text-center mt-24'>{predictedClass}</h1>
              {historyText && <h1 className='text-white text-xl font-medium text-center'>{historyText}</h1>}
            </div>
          )}
        </div>
        {cameraActive && (
          <div className='flex justify-center'>
            <button className='p-3 mt-6 mx-10 w-[150px] text-white font-semibold bg-[#474747] rounded-lg hover:bg-[#3e3e3e]' onClick={takePhoto}>Tomar Foto</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CameraComponent;
