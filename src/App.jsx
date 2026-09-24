import React, { useState, useRef } from 'react';
import { PromptInput } from './components/PromptInput.jsx';
import { TripHeader } from './components/TripHeader.jsx';
import { DaySection } from './components/DaySection.jsx';
import { LoadingState } from './components/LoadingState.jsx';
import { ErrorState } from './components/ErrorState.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { generateTripFromApi } from './lib/api.js';
import { validateTrip } from './lib/validateTrip.js';

export function App() {
  const [prompt, setPrompt] = useState('');
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStopIds, setExpandedStopIds] = useState({});

  const activeRequestIdRef = useRef(0);

  const handleGenerateTrip = async (promptText) => {
    if (!promptText || !promptText.trim()) return;

    const requestId = ++activeRequestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const rawTripData = await generateTripFromApi(promptText);

      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      const validation = validateTrip(rawTripData);

      if (!validation.isValid) {
        throw new Error(validation.error || 'The trip data failed schema validation.');
      }

      setTrip(validation.data);

      const initialExpanded = {};
      validation.data.days.forEach(day => {
        day.stops.forEach(stop => {
          initialExpanded[stop.id] = true;
        });
      });
      setExpandedStopIds(initialExpanded);
      setIsLoading(false);
    } catch (err) {
      if (requestId !== activeRequestIdRef.current) {
        return;
      }
      setError(err.message || 'Failed to generate itinerary. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (prompt.trim()) {
      handleGenerateTrip(prompt);
    }
  };

  const handleReset = () => {
    setTrip(null);
    setError(null);
    setPrompt('');
    setExpandedStopIds({});
  };

  const handleToggleExpandStop = (stopId) => {
    setExpandedStopIds(prev => ({
      ...prev,
      [stopId]: !prev[stopId]
    }));
  };

  const areAllStopsExpanded = () => {
    if (!trip || !trip.days) return false;
    const allStopIds = trip.days.flatMap(d => d.stops.map(s => s.id));
    if (allStopIds.length === 0) return false;
    return allStopIds.every(id => Boolean(expandedStopIds[id]));
  };

  const handleToggleAllExpand = () => {
    if (!trip || !trip.days) return;
    const allStopIds = trip.days.flatMap(d => d.stops.map(s => s.id));
    const allCurrentlyExpanded = areAllStopsExpanded();

    const newMap = {};
    allStopIds.forEach(id => {
      newMap[id] = !allCurrentlyExpanded;
    });
    setExpandedStopIds(newMap);
  };

  const handleMoveStop = (dayIndex, stopIndex, direction) => {
    setTrip(prevTrip => {
      if (!prevTrip) return prevTrip;

      const newDays = [...prevTrip.days];
      const targetDay = { ...newDays[dayIndex] };
      const newStops = [...targetDay.stops];

      const newIndex = stopIndex + direction;
      if (newIndex < 0 || newIndex >= newStops.length) {
        return prevTrip;
      }

      const temp = newStops[stopIndex];
      newStops[stopIndex] = newStops[newIndex];
      newStops[newIndex] = temp;

      targetDay.stops = newStops;
      newDays[dayIndex] = targetDay;

      return {
        ...prevTrip,
        days: newDays
      };
    });
  };

  const handleRemoveStop = (dayIndex, stopIndex) => {
    setTrip(prevTrip => {
      if (!prevTrip) return prevTrip;

      const newDays = [...prevTrip.days];
      const targetDay = { ...newDays[dayIndex] };
      targetDay.stops = targetDay.stops.filter((_, idx) => idx !== stopIndex);
      newDays[dayIndex] = targetDay;

      return {
        ...prevTrip,
        days: newDays
      };
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-group">
            <span className="logo-icon" aria-hidden="true">🧭</span>
            <div>
              <h1 className="app-title">Trip Planner AI</h1>
              <p className="app-subtitle">Intelligent, customized travel itineraries in structured JSON</p>
            </div>
          </div>
          <div className="badge-tech">
            <span>React + Express + AI</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="section-prompt">
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerateTrip}
            isLoading={isLoading}
          />
        </section>

        <section className="section-results">
          {isLoading && <LoadingState message="Planning your personalized itinerary..." />}

          {!isLoading && error && (
            <ErrorState
              error={error}
              onRetry={handleRetry}
            />
          )}

          {!isLoading && !error && trip && (
            <div className="itinerary-wrapper">
              <TripHeader
                trip={trip}
                onReset={handleReset}
                onToggleAllExpand={handleToggleAllExpand}
                isAllExpanded={areAllStopsExpanded()}
              />

              <div className="days-container">
                {trip.days.map((day, dayIndex) => (
                  <DaySection
                    key={day.day || dayIndex}
                    dayData={day}
                    dayIndex={dayIndex}
                    expandedStopIds={expandedStopIds}
                    onToggleExpandStop={handleToggleExpandStop}
                    onMoveStop={handleMoveStop}
                    onRemoveStop={handleRemoveStop}
                  />
                ))}
              </div>
            </div>
          )}

          {!isLoading && !error && !trip && <EmptyState />}
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Trip Planner AI &bull; Frontend Internship Assignment Project &bull; Built with React &amp; Express
        </p>
      </footer>
    </div>
  );
}

export default App;
