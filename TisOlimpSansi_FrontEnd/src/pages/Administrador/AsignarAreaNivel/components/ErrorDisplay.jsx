import React from "react";

const ErrorDisplay = ({ error }) => {
  return (
    <div className="text-center py-8 text-red-600">
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reintentar
      </button>
    </div>
  );
};

export default ErrorDisplay;