import React from "react";

export default function NavigationButtons({
  onBack,
  onNext,
  isSubmitting,
  isFormValid,
}) {
  return (
    <div className="flex justify-between mt-6">
      <button
        type="button"
        className="bg-[#4C8EDA] text-white py-2 px-4 rounded-md hover:bg-[#2e4f96]"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Atrás
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting || !isFormValid}
        className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md ${
          isFormValid && !isSubmitting
            ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Procesando..." : "Siguiente"}
      </button>
    </div>
  );
}