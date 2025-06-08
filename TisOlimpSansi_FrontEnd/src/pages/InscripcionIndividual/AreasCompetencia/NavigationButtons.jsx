const NavigationButtons = ({ handleBack, handleSubmitAndNext, isValid }) => {
  return (
    <div className="flex justify-center mt-8 gap-4">
      <button
        type="button"
        className="px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md bg-gray-500 hover:-translate-y-1 hover:scale-105 hover:bg-gray-600"
        onClick={handleBack}
      >
        Atrás
      </button>
      <button
        type="button"
        className={`px-6 py-2 transition duration-300 ease-in-out text-white rounded-md shadow-md 
          ${
            isValid
              ? "bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        onClick={handleSubmitAndNext}
        disabled={!isValid}
      >
        Siguiente
      </button>
    </div>
  );
};

export default NavigationButtons;