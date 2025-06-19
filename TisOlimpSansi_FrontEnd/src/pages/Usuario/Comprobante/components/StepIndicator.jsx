const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between gap-4 sm:gap-6 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4 hide-scrollbar sm:justify-start lg:justify-between lg:overflow-x-hidden">
      {steps.map((stepLabel, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;

        return (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0 w-24"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                isActive || isCompleted
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-400 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-[13px] mt-2 text-center break-words ${
                isActive || isCompleted ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {stepLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;