-- Drop database if it exists
DROP DATABASE IF EXISTS financialdb;

-- Drop user if it exists
DROP USER IF EXISTS financial_admin;

-- Create the database
CREATE DATABASE financialdb;

-- Create the user
CREATE USER financial_admin WITH PASSWORD 'financial_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE financialdb TO financial_admin; 