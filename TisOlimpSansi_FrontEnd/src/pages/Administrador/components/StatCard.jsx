import React from 'react';

const StatCard = ({ title, value, icon, bgColor, textColor, darkMode }) => {
  const darkModeClasses = darkMode ? "bg-gray-800 text-white" : `${bgColor}`;
  const darkModeTextColor = darkMode ? "text-white" : textColor;

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkModeClasses}`}>
      <div className="flex justify-between">
        <div>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } font-medium`}
          >
            {title}
          </p>
          <h3 className={`text-3xl font-bold mt-2 ${darkModeTextColor}`}>
            {value}
          </h3>
        </div>
        <div className={`text-3xl ${darkModeTextColor} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;