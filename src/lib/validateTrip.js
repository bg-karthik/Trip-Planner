export function validateTrip(data) {
  if (!data) {
    return { isValid: false, error: 'Empty response received from the server.' };
  }

  let trip = data;
  if (typeof data === 'string') {
    try {
      trip = JSON.parse(data);
    } catch {
      return { isValid: false, error: 'Received malformed JSON string that could not be parsed.' };
    }
  }

  if (typeof trip !== 'object' || trip === null || Array.isArray(trip)) {
    return { isValid: false, error: 'Trip payload must be a JSON object.' };
  }

  if (!trip.tripTitle || typeof trip.tripTitle !== 'string' || trip.tripTitle.trim() === '') {
    return { isValid: false, error: 'Trip is missing a valid "tripTitle" string.' };
  }

  if (!trip.destination || typeof trip.destination !== 'string' || trip.destination.trim() === '') {
    return { isValid: false, error: 'Trip is missing a valid "destination" string.' };
  }

  if (typeof trip.summary !== 'string') {
    trip.summary = `${trip.tripTitle} - Custom itinerary for ${trip.destination}.`;
  }

  if (!Array.isArray(trip.days)) {
    return { isValid: false, error: '"days" property must be an array.' };
  }

  if (trip.days.length === 0) {
    return {
      isValid: false,
      error: 'The AI could not generate an itinerary for this prompt. Please try providing more details.'
    };
  }

  const sanitizedDays = [];

  for (let i = 0; i < trip.days.length; i++) {
    const dayObj = trip.days[i];

    if (!dayObj || typeof dayObj !== 'object') {
      return { isValid: false, error: `Day at index ${i} is not a valid object.` };
    }

    const dayNumber = Number(dayObj.day) || i + 1;
    const dayTitle = typeof dayObj.title === 'string' && dayObj.title.trim() !== ''
      ? dayObj.title.trim()
      : `Day ${dayNumber}`;

    if (!Array.isArray(dayObj.stops)) {
      return { isValid: false, error: `Day ${dayNumber} ("${dayTitle}") is missing a "stops" array.` };
    }

    if (dayObj.stops.length === 0) {
      return { isValid: false, error: `Day ${dayNumber} has no planned stops.` };
    }

    const sanitizedStops = [];

    for (let j = 0; j < dayObj.stops.length; j++) {
      const stop = dayObj.stops[j];

      if (!stop || typeof stop !== 'object') {
        return { isValid: false, error: `Stop ${j + 1} on Day ${dayNumber} is malformed.` };
      }

      if (!stop.name || typeof stop.name !== 'string' || stop.name.trim() === '') {
        return { isValid: false, error: `A stop on Day ${dayNumber} is missing a valid "name".` };
      }

      const id = stop.id && typeof stop.id === 'string' && stop.id.trim() !== ''
        ? stop.id.trim()
        : `stop-${dayNumber}-${j + 1}-${Date.now()}`;

      sanitizedStops.push({
        id,
        name: stop.name.trim(),
        time: typeof stop.time === 'string' && stop.time.trim() !== '' ? stop.time.trim() : 'Flexible Time',
        duration: typeof stop.duration === 'string' && stop.duration.trim() !== '' ? stop.duration.trim() : '1-2 hours',
        description: typeof stop.description === 'string' && stop.description.trim() !== ''
          ? stop.description.trim()
          : 'Explore this destination and enjoy the experience.',
        category: typeof stop.category === 'string' && stop.category.trim() !== ''
          ? stop.category.trim()
          : 'Sightseeing'
      });
    }

    sanitizedDays.push({
      day: dayNumber,
      title: dayTitle,
      stops: sanitizedStops
    });
  }

  return {
    isValid: true,
    data: {
      tripTitle: trip.tripTitle.trim(),
      destination: trip.destination.trim(),
      summary: trip.summary.trim(),
      days: sanitizedDays
    }
  };
}
