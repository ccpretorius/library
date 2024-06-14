// src/components/CustomBarcodeScanner.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Quagga from "quagga";

const CustomBarcodeScanner = ({ onScan }) => {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (scanning) {
      const id = setInterval(handleScan, 1000);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [scanning]);

  const handleScan = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    console.log("Capturing image...");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      Quagga.decodeSingle(
        {
          locate: true,
          src: imageSrc,
          numOfWorkers: 0, // Needs to be 0 when used with webpack
          inputStream: {
            size: 800, // restrict input-size to be 800
          },
          decoder: {
            readers: ["ean_reader"], // List of active readers
          },
        },
        (result) => {
          if (result && result.codeResult) {
            console.log("Scanned result: ", result.codeResult.code);
            onScan(result.codeResult.code);
            setScanning(false);
          } else {
            console.log("No result from scanner.");
          }
        }
      );
    };
  }, [onScan]);

  return (
    <div className="w-full flex flex-col items-center">
      <button onClick={() => setScanning(!scanning)} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        {scanning ? "Stop Scan" : "Start Scan"}
      </button>
      {scanning && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full"
          videoConstraints={{
            facingMode: "environment",
            width: 1920,
            height: 1080,
          }}
        />
      )}
    </div>
  );
};

export default CustomBarcodeScanner;
