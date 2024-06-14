// src/components/CustomBarcodeScanner.jsx
import React, { useState, useEffect } from "react";
import Quagga from "quagga";

const CustomBarcodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (scanning) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              facingMode: "environment", // or user for the front camera
            },
            area: {
              top: "0%",
              right: "0%",
              left: "0%",
              bottom: "0%", // defines the detection area
            },
          },
          locator: {
            patchSize: "medium", // x-small, small, medium, large, x-large
            halfSample: true,
          },
          numOfWorkers: 4,
          frequency: 10,
          decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"], // Add other readers if needed
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error(err);
            setStatusMessage("Error initializing Quagga");
            return;
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
        }
      );

      Quagga.onProcessed((result) => {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(0, 0, drawingCanvas.getAttribute("width"), drawingCanvas.getAttribute("height"));
            result.boxes
              .filter(function (box) {
                return box !== result.box;
              })
              .forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, { color: "red", lineWidth: 3 });
          }
        }
      });

      Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        console.log("Barcode detected and processed : [" + code + "]", data);
        onScan(code);
        setResult(code);
        setStatusMessage("Barcode detected: " + code);
        Quagga.stop();
        setScanning(false);
      });

      return () => {
        Quagga.offDetected();
        Quagga.stop();
      };
    }
  }, [scanning, onScan]);

  const handleStartScan = () => {
    setScanning(true);
    setResult("");
    setStatusMessage("Scanning...");
  };

  return (
    <div className="scanner">
      <button onClick={handleStartScan} className="bg-blue-500 text-white py-2 px-4 rounded">
        Start Scanning
      </button>
      {scanning && (
        <div className="mt-4">
          <div id="interactive" className="viewport" />
          <p>{statusMessage}</p>
        </div>
      )}
      {!scanning && result && (
        <div className="mt-4">
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CustomBarcodeScanner;
