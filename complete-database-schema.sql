-- Complete Financial Dashboard Schema for Supabase
-- Modified to work with Supabase Auth (auth.users table)

-- Drop existing tables if they exist (clean slate approach)
DROP TABLE IF EXISTS organization_categories CASCADE;
DROP TABLE IF EXISTS user_budgets CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS liabilities CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS organization_users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL DEFAULT 'User',
    full_name TEXT DEFAULT '',
    currency TEXT DEFAULT 'USD',
    avatar_url TEXT DEFAULT '',
    active_organization_id INTEGER, -- Can be NULL for personal accounts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create the 'organizations' table
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    org_name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to profiles table
ALTER TABLE profiles ADD CONSTRAINT fk_active_organization
FOREIGN KEY (active_organization_id) REFERENCES organizations(organization_id);

-- Create the linking table for users, organizations, and their roles
CREATE TABLE organization_users (
    org_user_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    UNIQUE(organization_id, user_id)
);

-- Create the 'transactions' table, now organization-aware
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Uncategorized',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'goals' table, now organization-aware
CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0.00,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'In-Progress'
);

-- Create the 'assets' table, now organization-aware
CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100),
    value DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'liabilities' table, now organization-aware
CREATE TABLE liabilities (
    liability_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    liability_name VARCHAR(255) NOT NULL,
    liability_type VARCHAR(100),
    amount_owed DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'invitations' table for business teams
CREATE TABLE invitations (
    invitation_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, email)
);

-- Create the 'user_budgets' table for custom budgets
CREATE TABLE user_budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    budget_amount DECIMAL(12, 2) NOT NULL,
    CONSTRAINT unique_user_category UNIQUE (user_id, category_name),
    CONSTRAINT unique_org_category UNIQUE (organization_id, category_name)
);

-- Create the 'organization_categories' table for custom business categories
CREATE TABLE organization_categories (
    category_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    category_name VARCHAR(255) NOT NULL,
    keywords TEXT[],
    UNIQUE(organization_id, category_name)
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for organizations
CREATE POLICY "Users can view their organizations" ON organizations
    FOR SELECT USING (auth.uid() = owner_id OR auth.uid() IN (
        SELECT user_id FROM organization_users WHERE organization_id = organizations.organization_id
    ));

CREATE POLICY "Organization owners can update their organizations" ON organizations
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can create organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Create policies for organization_users
CREATE POLICY "Users can view their organization memberships" ON organization_users
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
        SELECT owner_id FROM organizations WHERE organization_id = organization_users.organization_id
    ));

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id OR (organization_id IS NOT NULL AND auth.uid() IN (
        SELECT user_id FROM organization_users WHERE organization_id = transactions.organization_id
    )));

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for goals
CREATE POLICY "Users can view their own goals" ON goals
    FOR SELECT USING (auth.uid() = user_id OR (organization_id IS NOT NULL AND auth.uid() IN (
        SELECT user_id FROM organization_users WHERE organization_id = goals.organization_id
    )));

CREATE POLICY "Users can insert their own goals" ON goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for assets
CREATE POLICY "Users can view their own assets" ON assets
    FOR SELECT USING (auth.uid() = user_id OR (organization_id IS NOT NULL AND auth.uid() IN (
        SELECT user_id FROM organization_users WHERE organization_id = assets.organization_id
    )));

CREATE POLICY "Users can insert their own assets" ON assets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets" ON assets
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for liabilities
CREATE POLICY "Users can view their own liabilities" ON liabilities
    FOR SELECT USING (auth.uid() = user_id OR (organization_id IS NOT NULL AND auth.uid() IN (
        SELECT user_id FROM organization_users WHERE organization_id = liabilities.organization_id
    )));

CREATE POLICY "Users can insert their own liabilities" ON liabilities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liabilities" ON liabilities
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_budgets
CREATE POLICY "Users can view their own budgets" ON user_budgets
    FOR SELECT USING (auth.uid() = user_id OR (organization_id IS NOT NULL AND auth.uid() IN (
        SELECT user_id FROM organization_users WHERE organization_id = user_budgets.organization_id
    )));

CREATE POLICY "Users can insert their own budgets" ON user_budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON user_budgets
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();