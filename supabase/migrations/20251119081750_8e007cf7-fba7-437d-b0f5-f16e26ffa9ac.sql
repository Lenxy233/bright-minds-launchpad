-- Allow guest purchases by making user_id nullable
ALTER TABLE user_purchases 
ALTER COLUMN user_id DROP NOT NULL;