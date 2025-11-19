-- Update bundle_type to match the format expected by the application
UPDATE bundle_links 
SET bundle_type = 'bma-bundle' 
WHERE bundle_type = 'BMA Bundle';