const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_TIMEOUT_MS = 35000;

export async function generateTripFromApi(prompt, signal) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    throw new Error('Please enter a trip description before submitting.');
  }

  const timeoutController = new AbortController();

  const timeoutId = setTimeout(() => {
    timeoutController.abort(
      new Error('The request timed out. The AI server took too long to respond.')
    );
  }, API_TIMEOUT_MS);

  const effectiveSignal = signal
    ? AbortSignal.any
      ? AbortSignal.any([signal, timeoutController.signal])
      : signal
    : timeoutController.signal;

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: prompt.trim() }),
      signal: effectiveSignal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const serverErrorMessage =
        data?.error ||
        `Server responded with error status ${response.status}.`;

      throw new Error(serverErrorMessage);
    }

    if (!data || !data.trip) {
      throw new Error('The server response was missing the trip payload.');
    }

    return data.trip;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled or timed out. Please try again.');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Unable to reach the server. Please check your internet connection or try again.'
      );
    }

    throw error;
  }
}