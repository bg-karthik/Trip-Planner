import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateTrip } from './generateTrip.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trip Planner AI backend is operational' });
});

app.post('/api/generate-trip', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return res.status(400).json({
        error: 'Invalid request: "input" must be a non-empty string.'
      });
    }

    const trip = await generateTrip(input.trim());
    return res.status(200).json({ trip });
  } catch (error) {
    console.error('[Server Error /api/generate-trip]:', error.message);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while generating your trip itinerary.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Trip Planner AI Server running at http://localhost:${PORT}`);
});
