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
````

---

## 5. Project Structure

```text
Trip/
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx
│   │   ├── TripHeader.jsx
│   │   ├── DaySection.jsx
│   │   ├── StopCard.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorState.jsx
│   │   └── EmptyState.jsx
│   ├── lib/
│   │   ├── api.js
│   │   └── validateTrip.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── index.js
│   └── generateTrip.js
├── test/
│   └── test-cases.js
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

## 6. Setup & Installation

### Prerequisites

* Node.js 18+
* npm
* Google Gemini API key

### Clone the Repository

```bash
git clone <repository-url>
cd Trip
```

### Install Dependencies

```bash
npm install
```

---

## 7. Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

For local frontend development:

```env
VITE_API_URL=http://localhost:5000
```

For the deployed Vercel frontend:

```env
VITE_API_URL=https://trip-planner-backend-bbfc.onrender.com
```

> **Important:** Never put the Gemini API key in frontend code or in a `VITE_` environment variable. The Gemini API key is used only by the backend.

---

## 8. How to Run Frontend & Backend

### Run Both Together

```bash
npm run dev
```

This starts:

* Frontend → Vite development server
* Backend → Express server

### Run Frontend Only

```bash
npm run client
```

### Run Backend Only

```bash
npm run server
```

### Run Tests

```bash
npm test
```

### Build Frontend

```bash
npm run build
```

---

## 9. Example Trip Prompts

Try prompts such as:

```text
3 days in Hyderabad with my family focused on history and food with a moderate budget
```

```text
5 days in Goa for two people, beaches and local food, relaxed budget
```

```text
4 days in Bangalore for a solo traveler interested in cafes, technology and local culture
```

```text
2 days in Delhi focusing on historical places and street food
```

The AI converts the natural-language request into a structured itinerary containing days and individual stops.

---

## 10. Error Handling & Edge Cases

The application is designed to handle common AI and network failures gracefully.

| Scenario                 | Handling                                          |
| ------------------------ | ------------------------------------------------- |
| Empty prompt             | Client-side validation                            |
| Invalid AI JSON          | JSON parsing error handled                        |
| Missing fields           | Schema validation                                 |
| Incorrect response shape | Validation failure                                |
| Empty AI response        | Error state                                       |
| Network failure          | Error message with retry                          |
| Slow API response        | 35-second request timeout                         |
| Request race condition   | Request ID guard prevents stale updates           |
| Missing API key          | Backend mock generator can provide local fallback |
| Server error             | Backend error returned to frontend safely         |

The application avoids crashing when the AI returns unexpected or malformed data.

---

## 11. Known Limitations

* AI-generated itineraries may contain inaccurate or outdated travel information.
* The application does not currently include user authentication.
* It does not persist trips after the page is refreshed.
* No database is used.
* The mock generator is intended only as a local development fallback.
* AI response quality depends on the configured LLM API.

---

## 12. Time Spent

The assignment was completed within the intended scope and time.

Approximate time spent:

* Project setup & React structure: ~1 hour
* UI implementation: ~1.5 hours
* AI/backend integration: ~1.5 hours
* Validation & error handling: ~1 hour
* Testing & debugging: ~1 hour
* Deployment & documentation: Update with actual time spent

**Total:** Update with actual total time spent.

---

## 13. Honest AI Usage Note

AI coding tools were used extensively during development for project scaffolding, implementation assistance, debugging, testing ideas, and documentation.

The generated implementation was reviewed, tested, and adapted to meet the assignment requirements.

The main areas of focus were:

* React state management
* LLM integration
* Structured JSON generation
* JSON/schema validation
* Error handling
* Interactive itinerary controls
* Responsive UI

The final implementation was reviewed and tested to ensure that I understand the architecture and the main technical decisions made in the project.

---

```
```
