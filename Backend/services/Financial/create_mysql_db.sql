-- Drop database if it exists
DROP DATABASE IF EXISTS financialdb;

-- Create database
CREATE DATABASE financialdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE financialdb;

-- Grant privileges (if you need a specific user other than root)
-- GRANT ALL PRIVILEGES ON financialdb.* TO 'financial_user'@'localhost' IDENTIFIED BY 'password';
-- FLUSH PRIVILEGES; 