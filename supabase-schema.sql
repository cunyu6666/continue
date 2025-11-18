-- 24/7 Store - Supabase Database Schema
-- Run this SQL in your Supabase SQL editor to set up the database

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT,
    items JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create index on customer_email for searching orders by email
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for new orders)
CREATE POLICY "Allow public insert" ON orders
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow public to read their own orders by email
CREATE POLICY "Allow public read own orders" ON orders
    FOR SELECT
    TO anon
    USING (true);

-- You may want to restrict this further to only allow users to see their own orders
-- by checking customer_email against authenticated user

-- Example: More restrictive policy (uncomment if using authentication)
-- CREATE POLICY "Allow users to see own orders" ON orders
--     FOR SELECT
--     TO authenticated
--     USING (auth.jwt() ->> 'email' = customer_email);

-- Create policy for service role to do anything (for admin dashboard)
CREATE POLICY "Service role can do anything" ON orders
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO service_role;
