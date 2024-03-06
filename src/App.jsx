import React, { useRef } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const takePhoto = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataURL = canvas.toDataURL('image/jpeg');
  
    // Convertir la URL de datos en un objeto Blob
    const blob = await (await fetch(dataURL)).blob();
  
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg'); // Adjuntar el Blob al FormData
  
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };
  


  return (
    <div className='bg-[#2c2c2c] h-[727px]'>
      <div>
        <h1 className='text-center text-white font-semibold text-4xl'>FLAG DETECTOR</h1>
        <div className='flex justify-center'>
          <button className='p-4 m-10 text-white font-semibold bg-[#5b5b5b] rounded-md' onClick={startCamera}>Activar Cámara</button>
          <button className='p-4 m-10 text-white font-semibold bg-[#5b5b5b] rounded-md' onClick={takePhoto}>Tomar Foto</button>
        </div>

        <div className='flex justify-center'>
          <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '640px' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
        </div>
      </div>
    </div>
  );
};

export default CameraComponent;
