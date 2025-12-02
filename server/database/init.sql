-- Lifelink Database Initialization Script
-- Run this after creating the database and enabling PostGIS

-- Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Note: Tables will be created automatically by Sequelize
-- This script is for reference and manual setup if needed

-- The following tables will be created by Sequelize:
-- - donors
-- - blood_requests
-- - blood_stocks
-- - blood_centers
-- - camps

-- To manually create tables, you can use the Sequelize models as reference
-- or run the application once and Sequelize will create them automatically

-- For PostGIS spatial queries, the latitude and longitude columns
-- can be used with PostGIS functions like ST_Distance, ST_MakePoint, etc.

-- Example spatial query to find nearest donors:
-- SELECT *, ST_Distance(
--   ST_MakePoint(longitude, latitude),
--   ST_MakePoint(77.1025, 28.7041)
-- ) * 111.325 AS distance_km
-- FROM donors
-- ORDER BY distance_km
-- LIMIT 10;

