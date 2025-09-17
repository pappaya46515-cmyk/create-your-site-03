-- Enable real-time updates for vehicles table
ALTER publication supabase_realtime ADD TABLE vehicles;

-- Set replica identity to track full row data for real-time updates
ALTER TABLE vehicles REPLICA IDENTITY FULL;