import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const NewPaint = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;
  }, []);

  const getCoordinates = (event) => {
    if (event.touches && event.touches.length > 0) {
      const { clientX, clientY } = event.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: clientX - rect.left,
        offsetY: clientY - rect.top,
      };
    } else {
      const { offsetX, offsetY } = event.nativeEvent;
      return { offsetX, offsetY };
    }
  };

  const startDrawing = (event) => {
    const { offsetX, offsetY } = getCoordinates(event);
    const ctx = canvasRef.current.getContext('2d');
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(event);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isErasing ? 'white' : color;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <div className="control-panel">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
        <button onClick={() => setIsErasing(!isErasing)}>{isErasing ? 'Paint Mode' : 'Erase Mode'}</button>
        <button onClick={clearCanvas}>Clear Canvas</button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas-element"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      ></canvas>
    </div>
  );
};

export default NewPaint;
