import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_PROMPT = `You are an expert travel planner AI.
Your sole job is to generate a realistic, structured travel itinerary based on the user's trip request.

CRITICAL OUTPUT RULES:
1. Return strictly a raw valid JSON object.
2. Do NOT output any markdown backticks (\`\`\` or \`\`\`json).
3. Do NOT include any conversational text, introductions, or explanations outside the JSON object.
4. Strictly follow this JSON schema:
{
  "tripTitle": "string (e.g., '3 Days in Hyderabad')",
  "destination": "string (primary city or location)",
  "summary": "string (1-2 sentences summarizing the trip style)",
  "days": [
    {
      "day": 1,
      "title": "string (theme or neighborhood for the day)",
      "stops": [
        {
          "id": "string (e.g. 'stop-1-1')",
          "name": "string (attraction or place name)",
          "time": "string (e.g. '10:00 AM')",
          "duration": "string (e.g. '1.5 hours')",
          "description": "string (1-2 sentences describing what to do)",
          "category": "string (e.g., 'Sightseeing', 'Food', 'History', 'Nature', 'Culture', 'Shopping', 'Relaxation')"
        }
      ]
    }
  ]
}

ITINERARY GUIDELINES:
- Generate realistic, well-paced days (prefer 3 to 5 stops per day).
- Keep descriptions clear, concise, and informative.
- If the user specifies days, match that number. If unspecified, default to a sensible 2 or 3-day plan.
- If the user request cannot reasonably produce a trip (e.g., gibberish or harmful prompt), return { "tripTitle": "Trip Unavailable", "destination": "Unknown", "summary": "Unable to generate itinerary for this request.", "days": [] }.
`;

function cleanJsonOutput(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

async function callGemini(apiKey, userPrompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: SYSTEM_PROMPT },
          { text: `User Trip Request: "${userPrompt}"\n\nGenerate the complete JSON itinerary now:` }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini API returned an empty response.');
  }

  return cleanJsonOutput(rawText);
}

async function callOpenAI(apiKey, userPrompt) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error('OpenAI API returned an empty response.');
  }

  return cleanJsonOutput(rawText);
}

function generateMockTrip(userPrompt) {
  const lower = userPrompt.toLowerCase();
  let destination = 'Hyderabad';
  let title = '3 Days in Hyderabad';

  if (lower.includes('paris')) {
    destination = 'Paris';
    title = '3 Days in Paris';
  } else if (lower.includes('tokyo') || lower.includes('japan')) {
    destination = 'Tokyo';
    title = '3 Days in Tokyo';
  } else if (lower.includes('goa')) {
    destination = 'Goa';
    title = '3 Days Beach Trip in Goa';
  } else if (lower.includes('new york') || lower.includes('nyc')) {
    destination = 'New York';
    title = '3 Days in New York City';
  } else if (lower.includes('delhi')) {
    destination = 'Delhi';
    title = '3 Days in Delhi';
  }

  return JSON.stringify({
    tripTitle: title,
    destination: destination,
    summary: `A balanced itinerary tailored to your preferences: "${userPrompt.slice(0, 80)}${userPrompt.length > 80 ? '...' : ''}".`,
    days: [
      {
        day: 1,
        title: "Iconic Landmarks & Heritage",
        stops: [
          {
            id: "stop-1-1",
            name: `${destination} Historic Center`,
            time: "09:30 AM",
            duration: "2 hours",
            description: "Begin your journey exploring the iconic architectural marvels and bustling local lanes.",
            category: "History"
          },
          {
            id: "stop-1-2",
            name: "Local Heritage Market & Souvenirs",
            time: "12:00 PM",
            duration: "1.5 hours",
            description: "Stroll through colorful stalls, handicraft shops, and cultural markets.",
            category: "Shopping"
          },
          {
            id: "stop-1-3",
            name: "Traditional Culinary Experience",
            time: "01:45 PM",
            duration: "1.5 hours",
            description: "Indulge in authentic regional specialties and refreshing local beverages.",
            category: "Food"
          },
          {
            id: "stop-1-4",
            name: "Sunset Lake & Promenade Walk",
            time: "05:30 PM",
            duration: "1.5 hours",
            description: "Relax by the waterfront during the golden hour with scenic skyline views.",
            category: "Relaxation"
          }
        ]
      },
      {
        day: 2,
        title: "Arts, Culture & Scenic Views",
        stops: [
          {
            id: "stop-2-1",
            name: "Premier City Museum & Galleries",
            time: "10:00 AM",
            duration: "2 hours",
            description: "Discover curated art collections, antique artifacts, and royal history.",
            category: "Culture"
          },
          {
            id: "stop-2-2",
            name: "Botanical Gardens & Green Oasis",
            time: "01:00 PM",
            duration: "1.5 hours",
            description: "Enjoy a tranquil afternoon walk among exotic flora, shaded gazebos, and water fountains.",
            category: "Nature"
          },
          {
            id: "stop-2-3",
            name: "Popular Street Food Trail",
            time: "04:30 PM",
            duration: "2 hours",
            description: "Sample famous snacks, pastries, and signature drinks recommended by locals.",
            category: "Food"
          }
        ]
      },
      {
        day: 3,
        title: "Modern Vibes & Memorable Farewell",
        stops: [
          {
            id: "stop-3-1",
            name: "Hilltop Viewpoint / Fort Overlook",
            time: "09:00 AM",
            duration: "2.5 hours",
            description: "Capture breathtaking panoramic photos of the city from the highest vantage point.",
            category: "Sightseeing"
          },
          {
            id: "stop-3-2",
            name: "Artisan Crafts & Boutique Hub",
            time: "12:30 PM",
            duration: "1.5 hours",
            description: "Pick up thoughtful handmade gifts, textiles, and memories to take back home.",
            category: "Shopping"
          },
          {
            id: "stop-3-3",
            name: "Celebratory Farewell Dinner",
            time: "07:30 PM",
            duration: "2 hours",
            description: "End the trip with an unforgettable multi-course meal in an atmospheric restaurant.",
            category: "Food"
          }
        ]
      }
    ]
  });
}

export async function generateTrip(userPrompt) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  let rawJsonText;

  if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
    rawJsonText = await callGemini(geminiKey, userPrompt);
  } else if (openAiKey && openAiKey !== 'your_openai_api_key_here') {
    rawJsonText = await callOpenAI(openAiKey, userPrompt);
  } else {
    rawJsonText = generateMockTrip(userPrompt);
  }

  try {
    const parsedData = JSON.parse(rawJsonText);
    return parsedData;
  } catch (parseError) {
    throw new Error(`The AI model generated malformed JSON: ${parseError.message}`);
  }
}
