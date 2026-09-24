import React from 'react';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-card error-state">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3 className="state-title error-title">Something went wrong</h3>
      <p className="error-message">
        {error || 'An unexpected error occurred while generating the itinerary.'}
      </p>
      <div className="error-actions">
        {onRetry && (
          <button
            type="button"
            className="retry-btn"
            onClick={onRetry}
          >
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  );
}
