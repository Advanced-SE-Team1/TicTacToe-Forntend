import React from 'react';
import '../styles/ResetButton.css'; // Import the CSS file

const ResetButton = ({ onReset }) => {
  return (
    <button onClick={onReset} className="reset-button">
      Reset
    </button>
  );
};

export default ResetButton;