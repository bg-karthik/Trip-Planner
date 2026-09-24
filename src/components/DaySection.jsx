import React from 'react';
import { StopCard } from './StopCard.jsx';

export function DaySection({
  dayData,
  dayIndex,
  expandedStopIds,
  onToggleExpandStop,
  onMoveStop,
  onRemoveStop
}) {
  const stops = dayData.stops || [];

  return (
    <div className="day-section">
      <div className="day-header">
        <div className="day-title-wrapper">
          <span className="day-badge">Day {dayData.day || dayIndex + 1}</span>
          <h3 className="day-title">{dayData.title}</h3>
        </div>
        <span className="day-stops-count">
          {stops.length} {stops.length === 1 ? 'stop' : 'stops'}
        </span>
      </div>

      <div className="stops-list">
        {stops.length === 0 ? (
          <div className="no-stops-message">
            <p>All stops for this day have been removed.</p>
          </div>
        ) : (
          stops.map((stop, stopIndex) => (
            <StopCard
              key={stop.id || `stop-${dayIndex}-${stopIndex}`}
              stop={stop}
              isFirst={stopIndex === 0}
              isLast={stopIndex === stops.length - 1}
              isExpanded={Boolean(expandedStopIds[stop.id])}
              onToggleExpand={() => onToggleExpandStop(stop.id)}
              onMoveUp={() => onMoveStop(dayIndex, stopIndex, -1)}
              onMoveDown={() => onMoveStop(dayIndex, stopIndex, 1)}
              onRemove={() => onRemoveStop(dayIndex, stopIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}
