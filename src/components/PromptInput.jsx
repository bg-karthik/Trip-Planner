import React from 'react';

const EXAMPLE_PROMPTS = [
  "I want to spend 3 days in Hyderabad with my family. We like history, food and relaxed sightseeing. Budget is moderate.",
  "4 days in Tokyo exploring vibrant anime culture, sushi spots, and scenic temples.",
  "3 days beach and heritage trip in Goa with friends. We want seafood, water activities, and relaxing sunsets.",
  "2 days in Paris focusing on famous art museums, romantic cafes, and iconic landmarks."
];

export function PromptInput({
  prompt,
  setPrompt,
  onGenerate,
  isLoading
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  const handleSelectExample = (example) => {
    if (!isLoading) {
      setPrompt(example);
    }
  };

  return (
    <div className="prompt-input-card">
      <form onSubmit={handleSubmit}>
        <label htmlFor="trip-prompt" className="prompt-label">
          Describe your dream trip:
        </label>
        
        <textarea
          id="trip-prompt"
          className="prompt-textarea"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., I want to spend 3 days in Hyderabad with my family. We like history, food and relaxed sightseeing..."
          disabled={isLoading}
        />

        <div className="prompt-actions">
          <div className="example-chips-container">
            <span className="example-chips-label">Try an example:</span>
            <div className="example-chips-list">
              {EXAMPLE_PROMPTS.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="example-chip-btn"
                  onClick={() => handleSelectExample(ex)}
                  disabled={isLoading}
                >
                  {ex.length > 42 ? ex.slice(0, 42) + '...' : ex}
                </button>
              ))}
            </div>
          </div>

          <div className="submit-btn-wrapper">
            <button
              type="submit"
              className="generate-btn"
              disabled={isLoading || !prompt.trim()}
              id="generate-trip-button"
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true"></span>
                  <span>Planning Trip...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
