-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events_data table
CREATE TABLE IF NOT EXISTS events_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('conference', 'workshop', 'meetup', 'exhibition', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE events_data ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read events
CREATE POLICY "Anyone can read events"
    ON events_data FOR SELECT
    USING (true);

-- Allow authenticated users to create events
CREATE POLICY "Authenticated users can create events"
    ON events_data FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own events (if we add a user_id column later)
-- CREATE POLICY "Users can update their own events"
--     ON events_data FOR UPDATE
--     USING (auth.uid() = user_id);

-- Allow users to delete their own events (if we add a user_id column later)
-- CREATE POLICY "Users can delete their own events"
--     ON events_data FOR DELETE
--     USING (auth.uid() = user_id);

-- Allow service role to manage all events
CREATE POLICY "Service role can manage all events"
    ON events_data FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS events_data_date_idx ON events_data(date);
CREATE INDEX IF NOT EXISTS events_data_category_idx ON events_data(category);
CREATE INDEX IF NOT EXISTS events_data_created_at_idx ON events_data(created_at); 