import React from 'react';

export function TripHeader({
  trip,
  onReset,
  onToggleAllExpand,
  isAllExpanded
}) {
  if (!trip) return null;

  const totalDays = trip.days ? trip.days.length : 0;
  const totalStops = trip.days
    ? trip.days.reduce((acc, curr) => acc + (curr.stops ? curr.stops.length : 0), 0)
    : 0;

  return (
    <div className="trip-header-card">
      <div className="trip-header-top">
        <div className="trip-title-area">
          <div className="destination-tag">
            <span className="location-pin">📍</span>
            <span>{trip.destination}</span>
          </div>
          <h2 className="trip-main-title">{trip.tripTitle}</h2>
        </div>

        <div className="trip-header-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onToggleAllExpand}
            title={isAllExpanded ? "Collapse all stop descriptions" : "Expand all stop descriptions"}
          >
            {isAllExpanded ? 'Collapse All' : 'Expand All Details'}
          </button>
          
          <button
            type="button"
            className="outline-btn"
            onClick={onReset}
            title="Start over with a new prompt"
          >
            + New Trip
          </button>
        </div>
      </div>

      {trip.summary && (
        <p className="trip-summary-text">{trip.summary}</p>
      )}

      <div className="trip-meta-stats">
        <div className="meta-stat-item">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</span>
        </div>
        <div className="meta-stat-divider"></div>
        <div className="meta-stat-item">
          <span className="stat-label">Total Stops</span>
          <span className="stat-value">{totalStops} {totalStops === 1 ? 'Location' : 'Locations'}</span>
        </div>
      </div>
    </div>
  );
}
