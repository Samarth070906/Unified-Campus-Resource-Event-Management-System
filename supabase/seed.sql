-- Seed Clubs
INSERT INTO public.clubs (name, description, email)
VALUES 
('Programming Club', 'For coding enthusiasts', 'coding@college.edu'),
('Robotics Club', 'Building the future', 'robotics@college.edu'),
('Music Club', 'Jamming sessions', 'music@college.edu')
ON CONFLICT DO NOTHING;

-- Seed Resources
INSERT INTO public.resources (name, type, capacity, is_active)
VALUES 
('Auditorium A', 'auditorium', 500, true),
('Seminar Hall 1', 'hall', 100, true),
('Conference Room B', 'room', 20, true),
('Projector Kit 1', 'equipment', null, true)
ON CONFLICT DO NOTHING;

-- Seed Bookings (Sample)
-- Note: UUIDs are hard to guess, so we usually rely on logic or fresh inserts. 
-- For now, just resources and clubs are enough to populate the lists.
