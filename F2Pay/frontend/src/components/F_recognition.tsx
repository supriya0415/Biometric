import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";


const FaceRecognition = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/folders")
      .then((res) => res.json()) 
      .then((data) => setFolders(data)) // Store array in state
      .catch((err) => console.error("Error:", err));
  }, []);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const labels = folders;
  console.log(labels)
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      ]);
    };

    loadModels();
  }, []);

  const stopRecording = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
    // Clear the canvas
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getLabeledFaceDescriptions = async () => {

    try {
      return Promise.all(
        labels.map(async (label) => {
          const descriptions = [];
          for (let i = 1; i <= 2; i++) {
            const imgUrl = `/labels/${label}/${i}.png`;
            console.log(`Loading image from: ${imgUrl}`);
            
            try {
              const img = await faceapi.fetchImage(imgUrl);
              const detections = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();
          
              
              if (detections) {
                descriptions.push(detections.descriptor);
       
           
              } else {
                console.error(`No face detected in image: ${imgUrl}`);
              }
            } catch (error) {
              console.error(`Error loading image ${imgUrl}:`, error);
            }
          }
          
          if (descriptions.length === 0) {
            throw new Error(`No face descriptions found for ${label}`);
          }
          
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    } catch (error) {
      console.error('Error in getLabeledFaceDescriptions:', error);
      throw error;
    }
  };



  const handleButtonClick = async () => {
    setIsRecording(true);
    startWebcam();
    videoRef.current.addEventListener('play', async () => {
      const labeledFaceDescriptors = await getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);

      const recognitionInterval = setInterval(async () => {
        if (isProcessing) return;

        try {
          setIsProcessing(true);
          const detections = await faceapi
            .detectAllFaces(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptors();

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

          const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor);
          });

          for (const result of results) {
            // console.log(result.toString())
            // const detectedLabel = result.toString().split(' ')[0]+" "+result.toString().split(' ')[1];
            const detectedLabel = result.label;
            

          
            const distance = parseFloat(result.toString().split(' ')[2]);
            console.log('Detected Person:', detectedLabel, 'Distance:', distance);
            
            if (videoRef.current?.srcObject) {
              const tracks = videoRef.current.srcObject.getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }

            if (folders.includes(detectedLabel)) {
              console.log('Match found! Redirecting...');
              clearInterval(recognitionInterval);
              navigate('/send-money');
             
              
       
              
              return;
            }
          }
        } finally {
          setIsProcessing(false);
        }
      }, 100);

      return () => {
        clearInterval(recognitionInterval);
      };
    });
  };

  return (
    <div>
       <video id="video" ref={videoRef} autoPlay muted width="720" height="560" />
       <canvas ref={canvasRef} />
      {!isRecording ? (
        <Button onClick={handleButtonClick}>Start Face Recognition</Button>
      ) : (
        <Button onClick={stopRecording}>Stop Recognition</Button>
      )}
     
    </div>
  );
};

export default FaceRecognition;