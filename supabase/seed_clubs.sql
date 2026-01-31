-- Insert sample clubs
INSERT INTO public.clubs (name, description, email)
VALUES 
    ('Coding Club', 'A community for developers and tech enthusiasts to learn and build together.', 'coding@campus.edu'),
    ('Robotics Club', 'Designing and building the future of robotics and automation.', 'robotics@campus.edu'),
    ('Music Club', 'Jam, perform, and appreciate music of all genres.', 'music@campus.edu'),
    ('Literature Club', 'For those who love reading, writing, and storytelling.', 'lit@campus.edu'),
    ('Dance Club', 'Express yourself through movement and rhythm.', 'dance@campus.edu')
ON CONFLICT (email) DO NOTHING;
