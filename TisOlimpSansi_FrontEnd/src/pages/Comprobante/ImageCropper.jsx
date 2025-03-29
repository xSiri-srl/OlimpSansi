import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; 

const ImageCropper = ({ image, onCrop }) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) return;

    croppedCanvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "cropped-image.png", { type: "image/png" });
        onCrop(file); 
      }
    }, "image/png");
  };

  return (
<div className="p-4">
  {/* Cropper Component */}
  {image && (
    <Cropper
      src={image}
      style={{ height: 300, width: "100%" }}
      guides={true} 
      ref={cropperRef}
      cropBoxResizable={true} 
      viewMode={1} 
      dragMode="move"
      aspectRatio={NaN} 
    />
  )}

  {/* Botón para activar el recorte */}
  <div className="flex justify-center mt-4">
    <button
      onClick={handleCrop}
      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600"
    >
      Seleccionar
    </button>
  </div>
</div>
  );
};

export default ImageCropper;
