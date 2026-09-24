import React from 'react';

export function LoadingState({ message = 'Planning your trip...' }) {
  return (
    <div className="state-card loading-state">
      <div className="spinner-glow-ring"></div>
      <h3 className="state-title">{message}</h3>
      <p className="state-subtitle">
        Analyzing your preferences, organizing day schedules, and curating the best local stops...
      </p>
      <div className="loading-steps-indicator">
        <span className="step-dot active"></span>
        <span className="step-dot active"></span>
        <span className="step-dot active"></span>
      </div>
    </div>
  );
}
