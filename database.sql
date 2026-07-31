-- Create the admin_sessions table
CREATE TABLE admin_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ip_address TEXT,
    user_agent TEXT
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Since this table is exclusively managed by the server using the Service Role Key,
-- no public policies are needed. The Service Role Key inherently bypasses RLS.
-- This ensures no anonymous or authenticated standard user can read/write sessions.
