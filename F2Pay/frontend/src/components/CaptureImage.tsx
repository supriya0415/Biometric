import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
const Camera = ({username}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);


  useEffect(() => { 
    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Error accessing webcam:", err));
  }, []);

  const captureImage = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png"); // Convert to base64
    setImage(imageData);

    // Send to backend with username
    axios.post("http://localhost:3000/upload", { image: imageData, username })
      .then(res => console.log("Image saved:", res.data))
      .catch(err => console.error("Error uploading:", err));
  };

  return (
    <div>
     
      <video ref={videoRef} autoPlay playsInline  muted
        style={{
          width: '720px',
          height: '560px',
          transform: 'scaleX(-1)'
        }} />
      <Button onClick={captureImage}>Capture</Button>
      <span className="text-yellow-500">  Capture at least 2 photos</span>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Camera;
