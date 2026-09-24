import React from 'react';

export function EmptyState() {
  return (
    <div className="state-card empty-state">
      <div className="empty-icon">🗺️</div>
      <h3 className="empty-title">Ready for your next adventure?</h3>
      <p className="empty-description">
        Type your destination, travel duration, group type, and favorite activities above, then click <strong>Generate Itinerary</strong> to get an organized daily schedule.
      </p>

      <div className="feature-grid">
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <h4>Structured AI Output</h4>
          <p>Strict schema validation ensures clean days and stops with timings.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔄</span>
          <h4>Interactive Customization</h4>
          <p>Reorder stops, collapse details, or remove attractions seamlessly in real-time.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <h4>Robust Error Handling</h4>
          <p>Built-in guards against malformed JSON, timeouts, and stale network requests.</p>
        </div>
      </div>
    </div>
  );
}
