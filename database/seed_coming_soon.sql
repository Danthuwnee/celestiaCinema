-- Seed data from TVMaze API - 10 coming-soon movies
-- Generated: 2026-06-21 21:50:29

-- 1. Holocaust
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('7d688a25-fc07-42d8-a304-626615fe7e03', 'Holocaust', 'This groundbreaking miniseries explores a decade in the lives of the members of an extended Jewish family and a German lawyer who becomes a Nazi officer. As the horrific events of the holocaust unfold, all will face unthinkable decisions and fates. Featuring a superb cast that includes Meryl Stre...', 200, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/12/31766.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Marvin J. Chomsky', 'Meryl Streep, James Woods, Michael Moriarty')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('7d688a25-fc07-42d8-a304-626615fe7e03', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('7d688a25-fc07-42d8-a304-626615fe7e03', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 2. Only Fools and Horses
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('f02fcd19-793f-44b6-9948-d5fc64749c18', 'Only Fools and Horses', 'Classic John Sullivan sitcom set in south London, centred on hapless market trader Del Boy, his brother Rodney, the rest of the Trotter clan and a host of Peckham characters.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/11/29077.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'John Sullivan', 'David Jason, Nicholas Lyndhurst')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('f02fcd19-793f-44b6-9948-d5fc64749c18', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6')
ON CONFLICT DO NOTHING;

-- 3. Mr. Robot
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('d667331b-a809-470f-888f-055a8aa6fdc0', 'Mr. Robot', 'Mr. Robot follows Elliot, a young programmer who works as a cyber-security engineer by day and as a vigilante hacker by night. Elliot finds himself at a crossroads when the mysterious leader of an underground hacker group recruits him to destroy the firm he is paid to protect. Compelled by his pe...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/211/528026.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Sam Esmail', 'Rami Malek, Christian Slater, Carly Chaikin')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('d667331b-a809-470f-888f-055a8aa6fdc0', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('d667331b-a809-470f-888f-055a8aa6fdc0', 'b0000001-0000-0000-0000-000000000007'),    ('d667331b-a809-470f-888f-055a8aa6fdc0', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 4. Bron / Broen
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('6729209f-f242-4c28-af05-7a7fca41a779', 'Bron / Broen', 'When a body is found on the bridge between Denmark and Sweden, right on the border, Danish inspector Martin Rohde and Swedish Saga Nor�n have to share jurisdiction and work together to find the killer.', 90, 'Ti?ng Th?y �i?n - Ph? d? Ti?ng Vi?t', T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/11/27700.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Hans Rosenfeldt, Mans Marlind', 'Sofia Helin, Kim Bodnia')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('6729209f-f242-4c28-af05-7a7fca41a779', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('6729209f-f242-4c28-af05-7a7fca41a779', 'b0000001-0000-0000-0000-000000000007'),    ('6729209f-f242-4c28-af05-7a7fca41a779', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 5. Steins;Gate
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('d2cdbb80-fdef-4d70-94af-91322740dee5', 'Steins;Gate', 'The microwave is a time machine. Okarin proved it. The self-anointed mad scientist nuked bananas into some gelatinous version of the future. Or maybe it was the past. Doesn''t matter. No one thought he could do it, but he did it anyway. He sent text messages through time to people he knew. To his ...', 80, 'Ti?ng Nh?t - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/373/933178.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Takuya Sato, Hiroshi Hamasaki', 'Mamoru Miyano, J. Michael Tatum, Asami Imai')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('d2cdbb80-fdef-4d70-94af-91322740dee5', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('d2cdbb80-fdef-4d70-94af-91322740dee5', '9d56ed24-3baa-417b-afa4-985f62bcfc4f'),    ('d2cdbb80-fdef-4d70-94af-91322740dee5', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 6. Dark Matter
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('e549effa-89f9-455f-a5b0-786259efb94c', 'Dark Matter', 'In Dark Matter, the crew of a derelict spaceship is awakened from stasis with no memories of who they are or how they got on board. Facing threats at every turn, they have to work together to survive a voyage charged with vengeance, betrayal and hidden secrets.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/122/305066.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Joseph Mallozzi, Paul Mullie', 'Marc Bendavid, Melissa ONeil, Anthony Lemke')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('e549effa-89f9-455f-a5b0-786259efb94c', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('e549effa-89f9-455f-a5b0-786259efb94c', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 7. Taken
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('8badc1fe-4388-4d20-aeee-d15f7fbab73e', 'Taken', 'Covering a period from 1947 to the present, Taken focused on three different families, each of whom was profoundly affected by extraterrestrial visitation. The Keys family was headed by WWII bomber pilot Russell Keys, who spent virtually his entire adult life haunted by his "close encounter" with...', 135, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/11/27603.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Leslie Bohem', 'Dakota Fanning, Matt Frewer, Emily Bergl')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('8badc1fe-4388-4d20-aeee-d15f7fbab73e', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 8. The Doctor Blake Mysteries
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('5fdc408f-2b64-4f2b-a096-7aec046bc6ad', 'The Doctor Blake Mysteries', 'Doctor Lucien Blake returns to Ballarat to once again solve a series of strange and baffling murders, only to find change is afoot, nothing is sacred, and no one is safe.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/113/284395.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'George Adams, Tony Wright', 'Craig McLachlan, Nadine Garner')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('5fdc408f-2b64-4f2b-a096-7aec046bc6ad', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('5fdc408f-2b64-4f2b-a096-7aec046bc6ad', 'b0000001-0000-0000-0000-000000000007'),    ('5fdc408f-2b64-4f2b-a096-7aec046bc6ad', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 9. Miranda
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('baa06cf2-6785-4b79-a2ee-ad6fd9df8bdf', 'Miranda', 'Sitcom starring Miranda Hart. It doesn''t matter what Miranda attempts in life, whether it''s dating or simply dealing with her overbearing mother, she always seems to fall flat, quite literally.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/12/31993.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Miranda Hart', 'Miranda Hart, Sarah Hadland, Tom Ellis')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('baa06cf2-6785-4b79-a2ee-ad6fd9df8bdf', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6')
ON CONFLICT DO NOTHING;

-- 10. The Avengers
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('774d32be-87fa-4a44-b9e1-c4ceee3293d8', 'The Avengers', 'Urbane John Steed and a variety of partners work for an elite organization tasked with investigating criminal and espionage matters within the UK. Their opponents use everything from standard techniques to robots and other science fiction gadgetry.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/543/1357959.jpg', '2026-07-21', '2026-09-04', 'COMING_SOON', 'Sydney Newman', 'Patrick Macnee, Honor Blackman, Diana Rigg')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('774d32be-87fa-4a44-b9e1-c4ceee3293d8', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('774d32be-87fa-4a44-b9e1-c4ceee3293d8', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('774d32be-87fa-4a44-b9e1-c4ceee3293d8', 'b0000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- End of coming-soon seed data
