-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  visit_frequency VARCHAR(100),
  recommendation VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(100) NOT NULL,
  table_number VARCHAR(50) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create winners table
CREATE TABLE IF NOT EXISTS winners (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(100) NOT NULL,
  table_number VARCHAR(50) NOT NULL,
  discount_percentage INTEGER NOT NULL,
  won_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_restaurant_id ON feedback(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback(submitted_at);
CREATE INDEX IF NOT EXISTS idx_winners_restaurant_id ON winners(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_winners_email ON winners(email);
