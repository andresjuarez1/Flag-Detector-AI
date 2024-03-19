import React, { useRef, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [predictedClass, setPredictedClass] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoRef.current.srcObject = stream;
      setCameraActive(true); // Establece la cámara como activa
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
      console.log(data);
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };

  return (
    <>
      <div className='bg-[#181818] w-full h-[727px]'>
        <div className='flex flex-col items-center'>

          <div className='bg-[#222222] w-full'>
            <h1 className='text-center text-white font-semibold text-4xl mt-4 mb-4'>FLAG DETECTOR</h1>
          </div>

          <h1 className='text-white text-2xl font-semibold mb-5 mt-4'>La bandera que se supone es de: {predictedClass}</h1>
          {!cameraActive && (
            <button className='p-3 mx-10 text-white font-semibold bg-[#474747] rounded-lg hover:bg-[#3e3e3e]' onClick={startCamera}>Activar Cámara</button>
          )}
          <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '640px', display: cameraActive ? 'block' : 'none' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
          {cameraActive && (
            <div className='flex justify-center'>
              <button className='p-3 mt-7 mx-10 text-white font-semibold bg-[#474747] rounded-lg hover:bg-[#3e3e3e]' onClick={takePhoto}>Tomar Foto</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CameraComponent;
