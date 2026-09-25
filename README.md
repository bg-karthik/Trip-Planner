# Trip Planner AI 🧭

An AI-powered travel itinerary generator built with **React**, **Node.js/Express**, and a structured LLM integration.

This project was built for a **Frontend Internship Assignment** by a 4th-year BTech student. It focuses on clean React fundamentals, structured AI responses, schema validation, error handling, and an interactive stateful itinerary.

---

## Live Demo

- **Live Application:** https://trip-planner-3078.vercel.app/

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Tech Stack](#3-tech-stack)
- [4. How It Works](#4-how-it-works)
- [5. Project Structure](#5-project-structure)
- [6. Setup & Installation](#6-setup--installation)
- [7. Environment Variables](#7-environment-variables)
- [8. How to Run Frontend & Backend](#8-how-to-run-frontend--backend)
- [9. Example Trip Prompts](#9-example-trip-prompts)
- [10. Error Handling & Edge Cases](#10-error-handling--edge-cases)
- [11. Known Limitations](#11-known-limitations)
- [12. Time Spent](#12-time-spent)
- [13. Honest AI Usage Note](#13-honest-ai-usage-note)

---

## 1. Project Overview

Trip Planner AI takes free-form natural language input such as:

> "3 days in Hyderabad with my family focused on history and food with a moderate budget"

and transforms it into an interactive day-by-day travel itinerary.

Unlike a generic chatbot interface, the application uses structured JSON output from the AI, validates the response, and renders it as an interactive UI that users can customize in real time.

---

## 2. Key Features

- 📝 **Free-Form Trip Input**
  - Natural language trip descriptions
  - Quick-select example prompts

- 🤖 **Structured AI Generation**
  - Backend prompt instructs the LLM to return a predictable JSON structure
  - Real Google Gemini API integration

- 🛡️ **Schema Validation**
  - Validates AI-generated itinerary data
  - Handles malformed JSON, missing fields, incorrect structures, and empty responses

- 🔄 **Interactive Itinerary Customization**
  - **Expand / Collapse:** View or hide additional itinerary details
  - **Reorder Stops:** Move stops up or down
  - **Remove Stops:** Delete unwanted stops dynamically

- ⚡ **Race Condition Protection**
  - Uses a request ID guard with `useRef`
  - Prevents older or slower requests from overwriting newer results

- 📱 **Responsive Design**
  - Works across desktop and mobile screen sizes
  - Built with vanilla CSS

- 🔁 **Loading, Empty & Error States**
  - Loading feedback while generating an itinerary
  - Empty state for the initial screen
  - Error state with retry support

---

## 3. Tech Stack

### Frontend

- React 18
- Functional Components
- React Hooks (`useState`, `useRef`)
- Vite 6
- Vanilla CSS

### Backend

- Node.js
- Express
- CORS
- dotenv
- REST API

### AI Integration

- Google Gemini API
- Structured JSON generation
- Backend-only API key handling
- Built-in mock generator for local development when no API key is configured

### Deployment

- **Frontend:** Vercel
- **Backend:** Render

---

## 4. How It Works

```text
[ User Input in React ]
        │
        ▼
[ Client API Service ]
        │
        ▼
[ Express Backend ]
        │
        ▼
[ LLM Layer: generateTrip.js ]
        │
        ├── Strict JSON Prompt
        │
        ▼
[ Google Gemini API ]
        │
        ▼
[ Structured JSON Response ]
        │
        ▼
[ Express Backend ]
        │
        ▼
[ Frontend Validator: validateTrip.js ]
        │
        ├── Validates trip data
        ├── Validates days
        └── Validates stops
        │
        ▼
[ React State ]
        │
        ▼
[ Interactive Itinerary UI ]
        ├── Expand / Collapse
        ├── Reorder
        └── Remove

## 5. Project Structure

```
Trip/
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx     # Textarea, submit button & example prompt chips
│   │   ├── TripHeader.jsx      # Title, destination badge, stats & actions
│   │   ├── DaySection.jsx      # Daily breakdown & stop card lists
│   │   ├── StopCard.jsx        # Individual stop with timings, category, reorder & delete
│   │   ├── LoadingState.jsx    # Loading spinner & progress status
│   │   ├── ErrorState.jsx      # Error banner with retry button
│   │   └── EmptyState.jsx      # Initial landing screen with feature highlights
│   ├── lib/
│   │   ├── api.js              # Client-side API client with timeout & abort handling
│   │   └── validateTrip.js     # Schema validation & data sanitization utility
│   ├── App.jsx                 # Main stateful component (Request guard, stop editing)
│   ├── main.jsx                # React root mount point
│   └── index.css               # Clean responsive styles
├── server/
│   ├── index.js                # Express API server & routes
│   └── generateTrip.js         # Isolated LLM service & prompt engineering
├── test/
│   └── test-cases.js           # Automated test suite for validator & edge cases
├── .env.example                # Environment variables template
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite config with backend proxy
└── README.md                   # Project documentation
```

---

## 6. Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (installed with Node)

### Installation Steps
1. Clone or open the project folder in your terminal:
   ```bash
   cd Trip
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 7. Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Set your preferred API key:
```ini
PORT=5000

# Google Gemini API Key (Recommended - Free tier available at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

---

## 8. How to Run Frontend & Backend

### Run Everything with One Command (Recommended)
```bash
npm run dev
```
This runs both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently. Open **`http://localhost:5173`** in your browser.

### Individual Commands
- **Frontend only**: `npm run client` (starts Vite at `http://localhost:5173`)
- **Backend only**: `npm run server` (starts Express at `http://localhost:5000`)
- **Build production bundle**: `npm run build`
- **Run automated validator tests**: `npm test`

---

## 9. Example Trip Prompts

Here are some sample prompts you can try:

- *"I want to spend 3 days in Hyderabad with my family. We like history, food and relaxed sightseeing. Budget is moderate."*
- *"4 days in Tokyo exploring vibrant anime culture, sushi spots, and scenic temples."*
- *"3 days beach and heritage trip in Goa with friends. We want seafood, water activities, and relaxing sunsets."*
- *"2 days in Paris focusing on famous art museums, romantic cafes, and iconic landmarks."*

---

## 10. Error Handling & Edge Cases

The project explicitly handles key failure modes:

| Scenario | Handling Strategy |
| :--- | :--- |
| **Malformed JSON** | `generateTrip.js` cleans markdown code blocks; `validateTrip.js` parses safely and returns an error without crashing. |
| **Wrong Schema Shape** | `validateTrip.js` verifies top-level metadata, days arrays, and stop fields before rendering. |
| **Empty AI Response** | Frontend catches missing payloads and renders the `<ErrorState>` with a retry button. |
| **Network / Server Down** | `api.js` catches fetch errors and displays a clear message asking to check the server. |
| **Slow Request / Timeout** | `api.js` implements a 35s `AbortController` timeout to prevent hanging UI. |
| **Stale Responses** | An `activeRequestIdRef` guard discards older inflight responses if a new request is triggered. |
| **Empty Input** | Frontend disables submission on empty strings; backend returns HTTP 400. |

---

## 11. Known Limitations

- **No Persistent Database**: Edits made to an itinerary (reordering/removing) are kept in React memory for the session.
- **Single Prompt Context**: Modifications are made client-side rather than re-prompting the LLM for conversational multi-turn edits (by design as this is an itinerary generator, not a chatbot).

---

## 12. Time Spent

- **Architecture & Schema Design**: ~45 minutes
- **Backend Express & LLM Integration**: ~1 hour
- **Validation Logic & Edge-Case Suite**: ~45 minutes
- **Frontend UI & Interactive React State**: ~1.5 hours
- **Styling, Mobile Responsiveness & Testing**: ~1 hour
- **Total Time**: ~5 hours

---

## 13. Honest AI Usage Note

AI coding tools were used to assist with initial boilerplate generation, refining edge-case testing, and drafting documentation. The student architected the solution, designed the component hierarchy, implemented the React state interactions and request guards, and reviewed all code for correctness and clarity.
