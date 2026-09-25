import { validateTrip } from '../src/lib/validateTrip.js';

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

console.log('--- Running Trip Planner AI Validator Tests ---');

const validTrip = {
  tripTitle: "3 Days in Hyderabad",
  destination: "Hyderabad",
  summary: "Relaxed history and food trip.",
  days: [
    {
      day: 1,
      title: "Old City Heritage",
      stops: [
        {
          id: "stop-1-1",
          name: "Charminar",
          time: "10:00 AM",
          duration: "1.5 hours",
          description: "Historic monument and bazaar.",
          category: "History"
        }
      ]
    }
  ]
};

const res1 = validateTrip(validTrip);
assert("Valid trip passes validation", res1.isValid === true && res1.data.tripTitle === "3 Days in Hyderabad");

const res2 = validateTrip(null);
assert("Null response fails validation gracefully", res2.isValid === false && res2.error.includes("Empty response"));

const res3 = validateTrip("{ bad json: broken }");
assert("Malformed JSON string fails validation", res3.isValid === false && res3.error.includes("malformed JSON"));

const missingTitle = { destination: "Goa", days: [] };
const res4 = validateTrip(missingTitle);
assert("Missing tripTitle fails validation", res4.isValid === false && res4.error.includes("tripTitle"));

const missingDest = { tripTitle: "Trip", days: [] };
const res5 = validateTrip(missingDest);
assert("Missing destination fails validation", res5.isValid === false && res5.error.includes("destination"));

const emptyDays = { tripTitle: "Trip", destination: "Goa", days: [] };
const res6 = validateTrip(emptyDays);
assert("Empty days array fails validation with helpful message", res6.isValid === false && res6.error.includes("could not generate an itinerary"));

const badDay = {
  tripTitle: "Trip",
  destination: "Goa",
  days: [{ day: 1, title: "Day 1" }]
};
const res7 = validateTrip(badDay);
assert("Day missing stops array fails validation", res7.isValid === false && res7.error.includes("missing a \"stops\" array"));

const badStop = {
  tripTitle: "Trip",
  destination: "Goa",
  days: [{
    day: 1,
    title: "Beach Day",
    stops: [{ id: "1", time: "10:00 AM" }]
  }]
};
const res8 = validateTrip(badStop);
assert("Stop missing name fails validation", res8.isValid === false && res8.error.includes("missing a valid \"name\""));

const unSanitizedTrip = {
  tripTitle: " Goa Trip ",
  destination: " Goa ",
  days: [{
    day: 1,
    title: " Day 1 ",
    stops: [{
      name: " Calangute Beach "
    }]
  }]
};
const res9 = validateTrip(unSanitizedTrip);
assert("Sanitizes missing stop fields with reliable defaults", 
  res9.isValid === true && 
  res9.data.days[0].stops[0].name === "Calangute Beach" &&
  res9.data.days[0].stops[0].time === "Flexible Time" &&
  res9.data.days[0].stops[0].category === "Sightseeing"
);

// Test generateTrip mock generator pipeline
const { generateTrip } = await import('../server/generateTrip.js');
try {
  const generatedTrip = await generateTrip("3 days in Hyderabad");
  const validationRes = validateTrip(generatedTrip);
  assert("generateTrip produces a valid itinerary structure", validationRes.isValid === true && validationRes.data.days.length > 0);
} catch (e) {
  console.error("DEBUG ERROR in generateTrip:", e);
  assert("generateTrip ran without throwing unhandled exceptions", false);
}

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
