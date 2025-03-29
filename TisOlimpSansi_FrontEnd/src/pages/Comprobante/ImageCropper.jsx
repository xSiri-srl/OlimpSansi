import React, { useRef, useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ image, onCrop }) => {
  const cropperRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (image) {
      setIsLoaded(true);
    }
  }, [image]);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      console.error("Cropper no está disponible.");
      return;
    }

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) {
      console.error("No se pudo obtener el canvas recortado.");
      return;
    }

    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("El blob resultante es undefined.");
        return;
      }

      const file = new File([blob], `cropped-image-${Date.now()}.png`, { type: "image/png" });
      console.log("Archivo recortado creado:", file);
      onCrop(file);
    }, "image/png");
  };

  return (
    <div className="p-4">
      {image ? (
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
      ) : (
        <p className="text-center text-gray-500">Cargando imagen...</p>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={handleCrop}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 ${
            !isLoaded ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isLoaded}
        >
          Seleccionar
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
