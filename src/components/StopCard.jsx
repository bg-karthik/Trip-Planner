import React from 'react';

function getCategoryBadgeClass(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return 'badge-food';
  if (cat.includes('history') || cat.includes('heritage')) return 'badge-history';
  if (cat.includes('nature') || cat.includes('park') || cat.includes('beach')) return 'badge-nature';
  if (cat.includes('shop')) return 'badge-shopping';
  if (cat.includes('culture') || cat.includes('art')) return 'badge-culture';
  if (cat.includes('relax')) return 'badge-relax';
  return 'badge-sightseeing';
}

export function StopCard({
  stop,
  isFirst,
  isLast,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onRemove
}) {
  return (
    <div className={`stop-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="stop-card-main">
        <div className="stop-card-left">
          <div className="stop-time-badge">
            <span className="time-icon">⏰</span>
            <span>{stop.time}</span>
          </div>
          {stop.duration && (
            <span className="stop-duration">({stop.duration})</span>
          )}
        </div>

        <div className="stop-card-content" onClick={onToggleExpand} style={{ cursor: 'pointer' }}>
          <div className="stop-card-header">
            <h4 className="stop-name">{stop.name}</h4>
            <span className={`category-tag ${getCategoryBadgeClass(stop.category)}`}>
              {stop.category || 'Sightseeing'}
            </span>
          </div>
          
          <div className="stop-preview-snippet">
            {isExpanded ? (
              <p className="stop-full-description">{stop.description}</p>
            ) : (
              <p className="stop-collapsed-hint">
                {stop.description ? (stop.description.slice(0, 75) + (stop.description.length > 75 ? '...' : '')) : 'Click to view details'}
              </p>
            )}
          </div>
        </div>

        <div className="stop-card-actions">
          <button
            type="button"
            className="action-btn reorder-btn"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move stop up"
            aria-label="Move stop up"
          >
            ▲
          </button>

          <button
            type="button"
            className="action-btn reorder-btn"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move stop down"
            aria-label="Move stop down"
          >
            ▼
          </button>

          <button
            type="button"
            className="action-btn expand-btn"
            onClick={onToggleExpand}
            title={isExpanded ? "Collapse details" : "Expand details"}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>

          <button
            type="button"
            className="action-btn remove-btn"
            onClick={onRemove}
            title="Remove stop from itinerary"
            aria-label="Remove stop"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
