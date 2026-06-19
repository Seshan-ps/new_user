import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Instantiate Supabase client (only if credentials are provided)
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully.');
} else {
  console.warn('Supabase URL or Anon Key is missing. Database integration will be disabled until configured.');
}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const status = {
    status: 'UP',
    timestamp: new Date(),
    services: {
      express: 'OK',
      database: 'UNKNOWN'
    }
  };

  if (supabase) {
    try {
      // Perform a simple check to verify DB connection
      const { data, error } = await supabase.from('_dummy_health_check').select('*').limit(1).maybeSingle();
      // If error is just table not found, it means database connection works but table doesn't exist
      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        status.services.database = 'ERROR';
        status.databaseError = error.message;
      } else {
        status.services.database = 'OK';
      }
    } catch (err) {
      status.services.database = 'ERROR';
      status.databaseError = err.message;
    }
  }

  res.json(status);
});

// Welcome root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Customer App API Server!',
    documentation: 'Refer to /api/health for system status.'
  });
});

// 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
