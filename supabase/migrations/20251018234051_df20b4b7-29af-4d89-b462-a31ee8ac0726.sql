-- Insert sample activities (one for each type)

-- 1. Matching Activity: Match Animals to Their Homes
INSERT INTO public.activities (id, title, description, activity_type, difficulty, age_range, is_published, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Match Animals to Their Homes', 'Help the animals find where they live!', 'matching', 'easy', '4-6 years', true, now());

INSERT INTO public.activity_items (activity_id, item_type, content, order_index, correct_answer)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'matching', '{"content": "Dog", "match": "Kennel"}', 0, 'Kennel'),
('550e8400-e29b-41d4-a716-446655440001', 'matching', '{"content": "Bird", "match": "Nest"}', 1, 'Nest'),
('550e8400-e29b-41d4-a716-446655440001', 'matching', '{"content": "Fish", "match": "Tank"}', 2, 'Tank'),
('550e8400-e29b-41d4-a716-446655440001', 'matching', '{"content": "Bee", "match": "Hive"}', 3, 'Hive'),
('550e8400-e29b-41d4-a716-446655440001', 'matching', '{"content": "Horse", "match": "Stable"}', 4, 'Stable');

-- 2. Drag & Drop Activity: Sort Fruits and Vegetables
INSERT INTO public.activities (id, title, description, activity_type, difficulty, age_range, is_published, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'Sort Fruits and Vegetables', 'Drag each item to the correct category!', 'drag-drop', 'easy', '5-7 years', true, now());

INSERT INTO public.activity_items (activity_id, item_type, content, order_index, correct_answer)
VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'drag-drop', '{"content": "Apple", "category": "fruit"}', 0, 'fruit'),
('550e8400-e29b-41d4-a716-446655440002', 'drag-drop', '{"content": "Carrot", "category": "vegetable"}', 1, 'vegetable'),
('550e8400-e29b-41d4-a716-446655440002', 'drag-drop', '{"content": "Banana", "category": "fruit"}', 2, 'fruit'),
('550e8400-e29b-41d4-a716-446655440002', 'drag-drop', '{"content": "Broccoli", "category": "vegetable"}', 3, 'vegetable'),
('550e8400-e29b-41d4-a716-446655440002', 'drag-drop', '{"content": "Orange", "category": "fruit"}', 4, 'fruit');

-- 3. Quiz Activity: What Color Is It?
INSERT INTO public.activities (id, title, description, activity_type, difficulty, age_range, is_published, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'What Color Is It?', 'Choose the correct color for each object!', 'quiz', 'easy', '3-5 years', true, now());

INSERT INTO public.activity_items (activity_id, item_type, content, order_index, correct_answer)
VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'quiz', '{"content": "What color is the sun?", "options": ["Yellow", "Blue", "Green", "Purple"]}', 0, 'Yellow'),
('550e8400-e29b-41d4-a716-446655440003', 'quiz', '{"content": "What color is grass?", "options": ["Red", "Green", "Pink", "Black"]}', 1, 'Green'),
('550e8400-e29b-41d4-a716-446655440003', 'quiz', '{"content": "What color is the sky?", "options": ["Orange", "Yellow", "Blue", "Brown"]}', 2, 'Blue'),
('550e8400-e29b-41d4-a716-446655440003', 'quiz', '{"content": "What color is snow?", "options": ["White", "Black", "Red", "Green"]}', 3, 'White'),
('550e8400-e29b-41d4-a716-446655440003', 'quiz', '{"content": "What color is a strawberry?", "options": ["Blue", "Yellow", "Red", "Purple"]}', 4, 'Red');

-- 4. Tap to Find Activity: Find the Shapes
INSERT INTO public.activities (id, title, description, activity_type, difficulty, age_range, is_published, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440004', 'Find the Shapes', 'Tap on all the circles you can find!', 'tap-find', 'easy', '4-6 years', true, now());

INSERT INTO public.activity_items (activity_id, item_type, content, order_index, correct_answer)
VALUES 
('550e8400-e29b-41d4-a716-446655440004', 'tap-find', '{"content": "Circle", "isTarget": true}', 0, 'true'),
('550e8400-e29b-41d4-a716-446655440004', 'tap-find', '{"content": "Square", "isTarget": false}', 1, 'false'),
('550e8400-e29b-41d4-a716-446655440004', 'tap-find', '{"content": "Circle", "isTarget": true}', 2, 'true'),
('550e8400-e29b-41d4-a716-446655440004', 'tap-find', '{"content": "Triangle", "isTarget": false}', 3, 'false'),
('550e8400-e29b-41d4-a716-446655440004', 'tap-find', '{"content": "Circle", "isTarget": true}', 4, 'true');

-- 5. True/False Activity: Animal Facts
INSERT INTO public.activities (id, title, description, activity_type, difficulty, age_range, is_published, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440005', 'Animal Facts: True or False?', 'Do you know these animal facts? Choose true or false!', 'true-false', 'medium', '6-8 years', true, now());

INSERT INTO public.activity_items (activity_id, item_type, content, order_index, correct_answer)
VALUES 
('550e8400-e29b-41d4-a716-446655440005', 'true-false', '{"content": "Dogs can bark", "isCorrect": true}', 0, 'true'),
('550e8400-e29b-41d4-a716-446655440005', 'true-false', '{"content": "Cats can fly", "isCorrect": false}', 1, 'false'),
('550e8400-e29b-41d4-a716-446655440005', 'true-false', '{"content": "Fish live in water", "isCorrect": true}', 2, 'true'),
('550e8400-e29b-41d4-a716-446655440005', 'true-false', '{"content": "Elephants are small", "isCorrect": false}', 3, 'false'),
('550e8400-e29b-41d4-a716-446655440005', 'true-false', '{"content": "Birds have wings", "isCorrect": true}', 4, 'true');

-- 6. Fill in the Blanks Activity: Complete the Sentence
INSERT INTO public.activities (id, title, description, activity_type, difficulty, age_range, is_published, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440006', 'Complete the Sentence', 'Fill in the missing word to complete each sentence!', 'fill-blanks', 'medium', '6-8 years', true, now());

INSERT INTO public.activity_items (activity_id, item_type, content, order_index, correct_answer)
VALUES 
('550e8400-e29b-41d4-a716-446655440006', 'fill-blanks', '{"content": "The sun shines in the ___", "blank": "sky"}', 0, 'sky'),
('550e8400-e29b-41d4-a716-446655440006', 'fill-blanks', '{"content": "I drink water with my ___", "blank": "mouth"}', 1, 'mouth'),
('550e8400-e29b-41d4-a716-446655440006', 'fill-blanks', '{"content": "Birds can ___ in the air", "blank": "fly"}', 2, 'fly'),
('550e8400-e29b-41d4-a716-446655440006', 'fill-blanks', '{"content": "We sleep at ___", "blank": "night"}', 3, 'night'),
('550e8400-e29b-41d4-a716-446655440006', 'fill-blanks', '{"content": "Flowers grow in the ___", "blank": "garden"}', 4, 'garden');