-- Seed data from TVMaze API - 30 movies (batch 2)
-- Generated: 2026-06-21 21:46:38

-- 1. Attack on Titan
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('521c70cb-3c60-40b7-9b9c-1e5d153f2bcf', 'Attack on Titan', 'Known in Japan as Shingeki no Kyojin, many years ago, the last remnants of humanity were forced to retreat behind the towering walls of a fortified city to escape the massive, man-eating Titans that roamed the land outside their fortress. Only the heroic members of the Scouting Legion dared to st...', 80, 'Ti?ng Nh?t - Ph? d? Ti?ng Vi?t', 'T18', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/476/1191684.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Tetsuro Araki', 'Yuki Kaji, Bryce Papenbrook, Marina Inoue')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('521c70cb-3c60-40b7-9b9c-1e5d153f2bcf', '9d56ed24-3baa-417b-afa4-985f62bcfc4f'),    ('521c70cb-3c60-40b7-9b9c-1e5d153f2bcf', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('521c70cb-3c60-40b7-9b9c-1e5d153f2bcf', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 2. The Twilight Zone
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('d711e55c-fa66-4438-a0a2-951ff0d19afe', 'The Twilight Zone', 'A groundbreaking series by Rod Serling, this half-hour anthology featured tales of the strange, the macabre, and the unusual. Some were science fiction, some were supernatural, and some defied easy categorization.This five-season series is best known for its twist endings. Many of the stories wer...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/398/996733.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Rod Serling', 'Rod Serling')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('d711e55c-fa66-4438-a0a2-951ff0d19afe', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('d711e55c-fa66-4438-a0a2-951ff0d19afe', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 3. Planet Earth
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('d47711e6-06d6-4620-bc81-d3839afae644', 'Planet Earth', 'David Attenborough celebrates the amazing variety of the natural world in this epic documentary series, filmed over four years across 64 different countries.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/15320.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Alastair Fothergill', 'David Attenborough')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('d47711e6-06d6-4620-bc81-d3839afae644', 'b0000001-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- 4. One Piece
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('7978be2c-33c2-46a5-9a02-c1fac4454122', 'One Piece', 'One Piece animation is based on the successful comic by Eiichiro Oda. The comic has sold more than 260 million copies. The success doesn''t stop; the One Piece animation series is in its top 5 TV ratings for kids programs in Japan for past few years and the series'' most recent feature film title "...', 80, 'Ti?ng Nh?t - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/504/1262497.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Konosuke Uda', 'Mayumi Tanaka, Colleen Clinkenbeard, Kazuya Nakai')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('7978be2c-33c2-46a5-9a02-c1fac4454122', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('7978be2c-33c2-46a5-9a02-c1fac4454122', '9d56ed24-3baa-417b-afa4-985f62bcfc4f'),    ('7978be2c-33c2-46a5-9a02-c1fac4454122', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 5. Hunter x Hunter
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('2f933e1d-93a2-4c14-8f34-49bb8e783cde', 'Hunter x Hunter', 'Remake of the 1999 TV series of Hunter x Hunter based on the manga by Togashi Yoshihiro. A Hunter is one who travels the world doing all sorts of dangerous tasks. From capturing criminals to searching deep within uncharted lands for any lost treasures. Gon is a young boy whose father disappeared ...', 80, 'Ti?ng Nh?t - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/223/559165.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Hiroshi Kojina', 'Megumi Han, Cristina Valenzuela, Issei Futamata')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('2f933e1d-93a2-4c14-8f34-49bb8e783cde', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('2f933e1d-93a2-4c14-8f34-49bb8e783cde', '9d56ed24-3baa-417b-afa4-985f62bcfc4f'),    ('2f933e1d-93a2-4c14-8f34-49bb8e783cde', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 6. Batman: The Animated Series
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('75eb6c0e-3cc8-459a-b01b-22a01d6b223a', 'Batman: The Animated Series', 'Experience the thrills of vigilante justice as millionaire playboy Bruce Wayne and alter-ego Batman protect the streets of Gotham City from a host of villains including archnemesis The Joker, deadly-beautiful Poison Ivy and primitive Killer Croc in a fresh take on super hero storytelling. Intelli...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/80/202273.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Bruce Timm, Eric Radomski', 'Kevin Conroy, Mark Hamill, Loren Lester')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('75eb6c0e-3cc8-459a-b01b-22a01d6b223a', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('75eb6c0e-3cc8-459a-b01b-22a01d6b223a', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 7. Cosmos
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('3d45a13b-4e01-4877-a01b-31753c133696', 'Cosmos', 'Hosted by renowned astrophysicist Neil deGrasse Tyson, Cosmos will explore how we discovered the laws of nature and found our coordinates in space and time. It will bring to life never-before-told stories of the heroic quest for knowledge and transport viewers to new worlds and across the univers...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/402/1006408.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Brannon Braga, Ann Druyan', 'Neil deGrasse Tyson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('3d45a13b-4e01-4877-a01b-31753c133696', '649b127c-61ff-43fc-af78-296ab910d1f5'),    ('3d45a13b-4e01-4877-a01b-31753c133696', 'b0000001-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- 8. Blackadder
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('47724187-99b9-4b73-aefa-a822d78c329b', 'Blackadder', 'Comedy set in different historical periods that features the ill-fated exploits of the mean-spirited Edmund Blackadder and his dim sidekick Baldrick.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/17102.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Richard Curtis, Ben Elton', 'Rowan Atkinson, Tony Robinson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('47724187-99b9-4b73-aefa-a822d78c329b', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('47724187-99b9-4b73-aefa-a822d78c329b', 'b0000001-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- 9. Endeavour
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('761fbcae-0113-4fda-b909-491c890c4251', 'Endeavour', 'The early days of a young Endeavour Morse, whose experiences as a detective constable with the Oxford City Police will ultimately shape his future.', 180, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/449/1123748.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Russell Lewis', 'Shaun Evans, Roger Allam, James Bradshaw')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('761fbcae-0113-4fda-b909-491c890c4251', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('761fbcae-0113-4fda-b909-491c890c4251', 'b0000001-0000-0000-0000-000000000007'),    ('761fbcae-0113-4fda-b909-491c890c4251', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 10. Black Books
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('3b3cd3bc-8802-46fd-92ce-15606e06b81c', 'Black Books', 'Black Books is a second-hand bookshop in London run by an Irishman named Bernard Black. He is probably the planet''s worst-suited person to run such an establishment: he makes no effort to sell, closes at strange hours on a whim, is in a perpetual alcoholic stupor, abhors his customers (sometimes ...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/81/204617.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Dylan Moran, Graham Linehan', 'Dylan Moran, Bill Bailey, Tamsin Greig')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('3b3cd3bc-8802-46fd-92ce-15606e06b81c', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6')
ON CONFLICT DO NOTHING;

-- 11. Doctor Who
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('1bedb2cc-fc6e-44c8-b95e-135624d12224', 'Doctor Who', 'Doctor Who is the longest-running science fiction TV series in history, airing initially from 1963 to 1989. Doctor Who is about ideas. It pioneered sophisticated mixed-level storytelling. Its format was the key to its longevity: the Doctor, a mysterious traveller in space and time, travels in his...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/488/1221842.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Russell T Davies, Sydney Newman', 'David Tennant, Jodie Whittaker, Matt Smith')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('1bedb2cc-fc6e-44c8-b95e-135624d12224', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('1bedb2cc-fc6e-44c8-b95e-135624d12224', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 12. Poldark
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('a73f8408-e93a-4fc2-b621-96937d345a73', 'Poldark', 'Britain is in the grip of a chilling recession... falling wages, rising prices, civil unrest - only the bankers are smiling. It''s 1783 and Ross Poldark returns from the American War of Independence to his beloved Cornwall to find his world in ruins: his father dead, the family mine long since clo...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/144/360117.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Debbie Horsfield', 'Aidan Turner, Eleanor Tomlinson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('a73f8408-e93a-4fc2-b621-96937d345a73', '1a409ed9-2b35-40b0-b677-14485b3c3db9')
ON CONFLICT DO NOTHING;

-- 13. Cowboy Bebop
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('9392be38-4337-407a-ac8c-305d257de7b6', 'Cowboy Bebop', 'In the year 2071, the crew of the spaceship Bebop travel the solar system trying to apprehend bounties. In the slang of the era, "Cowboys" are bounty hunters. Most episodes revolve around a specific bounty, but the show often shares its focus with the pasts of one of each of the four main charact...', 80, 'Ti?ng Nh?t - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/178/446548.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Shinichiro Watanabe', 'Koichi Yamadera, Steve Blum, Beau Billingslea')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('9392be38-4337-407a-ac8c-305d257de7b6', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('9392be38-4337-407a-ac8c-305d257de7b6', '9d56ed24-3baa-417b-afa4-985f62bcfc4f'),    ('9392be38-4337-407a-ac8c-305d257de7b6', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 14. Strike Back
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('268d976a-2060-426b-aa82-cd5b47d3b66b', 'Strike Back', 'Strike Back is a British/American action and military television series, based on a novel of the same name by novelist and former Special Air Service (SAS) soldier Chris Ryan. The series follows the actions of Section 20, a secretive branch of the British Defence Intelligence service (DI), who op...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/485/1213247.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Chris Ryan', 'Richard Armitage, Philip Winchester, Sullivan Stapleton')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('268d976a-2060-426b-aa82-cd5b47d3b66b', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('268d976a-2060-426b-aa82-cd5b47d3b66b', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 15. The Unit
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('8b5305e4-36eb-48fe-8606-b867ea9e56b5', 'The Unit', 'The Unit is a covert Special Forces team that does not exist. Their cover is the 303rd logistical studies group. They are assigned covert military operations by the President and never get credit for their actions. Their wives are also a tight group protecting their husbands. They protect their h...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/87/219977.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'David Mamet', 'Dennis Haysbert, Robert Patrick, Scott Foley')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('8b5305e4-36eb-48fe-8606-b867ea9e56b5', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('8b5305e4-36eb-48fe-8606-b867ea9e56b5', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('8b5305e4-36eb-48fe-8606-b867ea9e56b5', 'b0000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- 16. Westworld
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('fa6b59b2-f492-4a86-992c-3122bba762be', 'Westworld', 'Westworld is a dark odyssey about the dawn of artificial consciousness and the evolution of sin. Set at the intersection of the near future and the reimagined past, it explores a world in which every human appetite, no matter how noble or depraved, can be indulged.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/445/1113927.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Jonathan Nolan, Lisa Joy', 'Evan Rachel Wood, Thandiwe Newton, Jeffrey Wright')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('fa6b59b2-f492-4a86-992c-3122bba762be', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('fa6b59b2-f492-4a86-992c-3122bba762be', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('fa6b59b2-f492-4a86-992c-3122bba762be', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 17. Humans
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('631f99e0-76c7-4082-b10e-d2e4c833bc1f', 'Humans', 'Humans is set in a parallel present where the latest must-have gadget for any busy family is a Synth � a highly-developed robotic servant eerily similar to its live counterpart. In the hope of transforming the way they live, one strained suburban family purchases a refurbished synth only to disco...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/182/457420.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Sam Vincent, Jonathan Brackley', 'Gemma Chan, Katherine Parkinson, Tom Goodman-Hill')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('631f99e0-76c7-4082-b10e-d2e4c833bc1f', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('631f99e0-76c7-4082-b10e-d2e4c833bc1f', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('631f99e0-76c7-4082-b10e-d2e4c833bc1f', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 18. Agatha Christie''s Poirot
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('70835f72-5a46-4f0b-a8e1-7ef0c01d3443', 'Agatha Christie''s Poirot', 'Whether he''s on holiday abroad, taking a countryside break or simply going about his business near his central London home, Poirot finds himself exercising his "little grey cells" by helping police investigate crimes and murders, whether they ask for his help or not.He''s often accompanied by his ...', 180, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/17471.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Clive Exton', 'David Suchet, Hugh Fraser, Philip Jackson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('70835f72-5a46-4f0b-a8e1-7ef0c01d3443', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('70835f72-5a46-4f0b-a8e1-7ef0c01d3443', 'b0000001-0000-0000-0000-000000000007'),    ('70835f72-5a46-4f0b-a8e1-7ef0c01d3443', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 19. Doc Martin
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('c0545779-b537-4238-aa13-f965a5dc5fbb', 'Doc Martin', 'Successful surgeon Dr Martin Ellingham relocates to the seaside village of Portwenn in Cornwall; but his gruff demeanour and poor bedside manner bring him into conflict with the locals as he begins his new life as a GP.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/423/1058629.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Dominic Minghella', 'Martin Clunes, Caroline Catz, Ian McNeice')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('c0545779-b537-4238-aa13-f965a5dc5fbb', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('c0545779-b537-4238-aa13-f965a5dc5fbb', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('c0545779-b537-4238-aa13-f965a5dc5fbb', 'b0000001-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- 20. Young Dracula
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('ba720f9f-bc82-47a9-b6cf-1dcd2f245bdc', 'Young Dracula', 'Fitting in is hard enough, but when your dad is Count Dracula, things go from hard to worse! Follow the comic misadventures of Vlad and Ingrid as they move from Transylvania to Britain with their narcissistic single dad, the Count.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T18', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/99/249076.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Danny Robins, Dan T. Sefton', 'Gerran Howell, Clare Thomas')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('ba720f9f-bc82-47a9-b6cf-1dcd2f245bdc', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('ba720f9f-bc82-47a9-b6cf-1dcd2f245bdc', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 21. Better Off Ted
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('49c0157c-a135-4c3f-9180-9595917cab74', 'Better Off Ted', 'Better Off Ted is a satirical office comedy about successful good guy, Ted Crisp, who runs research and development at Veridian Dynamics, a company with a morally questionable approach to its employees. Whether it''s standing by a memo with a typo that encourages employees to now (as opposed to no...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/15323.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Victor Fresco', 'Jay Harrington, Andrea Anders, Portia de Rossi')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('49c0157c-a135-4c3f-9180-9595917cab74', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6')
ON CONFLICT DO NOTHING;

-- 22. Primeval
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('9796b1e8-bc8d-46ac-a3d5-d4df82d9968b', 'Primeval', 'When rips in time called anomalies started opening across the UK, dangerous creatures from the past and future began appearing in the most unexpected places, endangering lives and placing the whole of humanity at risk.A crack team of specialists were appointed by the government to investigate and...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/16152.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Tim Haines, Adrian Hodges', 'Douglas Henshall, Andrew Lee Potts, Hannah Spearritt')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('9796b1e8-bc8d-46ac-a3d5-d4df82d9968b', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('9796b1e8-bc8d-46ac-a3d5-d4df82d9968b', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('9796b1e8-bc8d-46ac-a3d5-d4df82d9968b', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 23. Coupling
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('6c14e771-8048-4e7d-b80b-825bb38d54cb', 'Coupling', 'Britcom about a group of six friends - three men and three women - and the ups and downs they encounter playing the 21st century dating game.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/17197.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Steven Moffat', 'Jack Davenport, Gina Bellman, Sarah Alexander')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('6c14e771-8048-4e7d-b80b-825bb38d54cb', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('6c14e771-8048-4e7d-b80b-825bb38d54cb', '1a409ed9-2b35-40b0-b677-14485b3c3db9')
ON CONFLICT DO NOTHING;

-- 24. Mr. Bean
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('55de73b0-f276-44d4-94d2-e2c3c0a649e9', 'Mr. Bean', 'The first episode of the original Mr. Bean series starring Rowan Atkinson was first broadcast on 1st January 1990. Since then Mr. Bean has become known all over the world. Created by Rowan Atkinson, Richard Curtis and Robin Driscoll, there were only 14 episodes ever made. The original series emer...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/45/113952.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Rowan Atkinson, Richard Curtis', 'Rowan Atkinson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('55de73b0-f276-44d4-94d2-e2c3c0a649e9', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('55de73b0-f276-44d4-94d2-e2c3c0a649e9', '9d56ed24-3baa-417b-afa4-985f62bcfc4f')
ON CONFLICT DO NOTHING;

-- 25. Later... with Jools Holland
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('ff36b0a9-67b9-42ec-a5ff-fc57e07a0630', 'Later... with Jools Holland', 'Jools Holland presents BBC Two''s flagship music show, with legendary musicians and brand new acts from around the world, all performing live.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/590/1477298.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Jools Holland', 'Jools Holland')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('ff36b0a9-67b9-42ec-a5ff-fc57e07a0630', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6')
ON CONFLICT DO NOTHING;

-- 26. Houdini
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('e4240207-2cc6-4f54-b558-00ebe53a3b62', 'Houdini', 'The event miniseries follows the epic tales of Harry Houdini as he emerges as America''s first bonafide world-renowned superstar. From humble beginnings at circus sideshows to sold-out concert halls, Eastern European immigrant Erich Weiss rose to become a household name across the globe - Houdini....', 180, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/7/17834.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Nicholas Meyer', 'Adrien Brody, Kristen Connolly')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('e4240207-2cc6-4f54-b558-00ebe53a3b62', '1a409ed9-2b35-40b0-b677-14485b3c3db9')
ON CONFLICT DO NOTHING;

-- 27. Over the Garden Wall
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('bb973944-b424-4fe9-b353-94e0b234836b', 'Over the Garden Wall', 'Created by Patrick McHale (Adventure Time), the 10-episode tale follows two brothers, Wirt and Greg (voiced by Elijah Wood and Collin Dean), who mysteriously find themselves outside of the world they know and in a forest called the Unknown. In a Wizard of Oz-like twist, they have stumbled into a ...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/9/24252.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Patrick McHale', 'Elijah Wood, Collin Dean, Melanie Lynskey')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('bb973944-b424-4fe9-b353-94e0b234836b', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('bb973944-b424-4fe9-b353-94e0b234836b', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('bb973944-b424-4fe9-b353-94e0b234836b', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 28. Spider-Man
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('7c1431b4-1034-4cd5-a1d5-9d57ed162e70', 'Spider-Man', 'Spider-Man (1994) tells the story of a 19-year-old Peter Parker in his first year at Empire State University, and his alter-ego Spider-Man. The show features Spider-Man''s classic villains, including the Kingpin, the Green Goblin, the Lizard, the Scorpion, Doctor Octopus, Mysterio, the Rhino, the ...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/8/21945.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Bob Richardson, John Semper', 'Christopher Daniel Barnes, Ed Asner')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('7c1431b4-1034-4cd5-a1d5-9d57ed162e70', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('7c1431b4-1034-4cd5-a1d5-9d57ed162e70', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 29. See No Evil
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('b87cd5ad-c5cb-4299-bf53-de4ca398ffb1', 'See No Evil', 'See No Evil pieces together the truth when shocking surveillance footage reveals breakthrough clues to solve a murder.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/499/1248505.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Various', 'Various')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('b87cd5ad-c5cb-4299-bf53-de4ca398ffb1', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('b87cd5ad-c5cb-4299-bf53-de4ca398ffb1', 'b0000001-0000-0000-0000-000000000007'),    ('b87cd5ad-c5cb-4299-bf53-de4ca398ffb1', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 30. Gangland Undercover
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('ab45cc3d-168f-4e58-9b81-23fdf6bd5180', 'Gangland Undercover', 'The only man brave enough to sneak into three outlaw biker gangs and live to tell the tale, Charles Falco, author of "Vagos, Mongols and Outlaws", goes from convict to infiltrator as he secretly documents the Vagos'' illegal activities and ultimately brings them to justice. With the real Charles F...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/9/23782.jpg', '2026-06-21', '2026-06-21', 'ACTIVE', 'Charles Falco', 'Charles Falco, Damon Runyan')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('ab45cc3d-168f-4e58-9b81-23fdf6bd5180', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('ab45cc3d-168f-4e58-9b81-23fdf6bd5180', 'b0000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- Update showing dates for all batch 2 movies
UPDATE movies SET showing_start_date = CURRENT_DATE - INTERVAL '10 days', showing_end_date = CURRENT_DATE + INTERVAL '45 days'
WHERE movie_id IN (
    '521c70cb-3c60-40b7-9b9c-1e5d153f2bcf',    'd711e55c-fa66-4438-a0a2-951ff0d19afe',    'd47711e6-06d6-4620-bc81-d3839afae644',    '7978be2c-33c2-46a5-9a02-c1fac4454122',    '2f933e1d-93a2-4c14-8f34-49bb8e783cde',    '75eb6c0e-3cc8-459a-b01b-22a01d6b223a',    '3d45a13b-4e01-4877-a01b-31753c133696',    '47724187-99b9-4b73-aefa-a822d78c329b',    '761fbcae-0113-4fda-b909-491c890c4251',    '3b3cd3bc-8802-46fd-92ce-15606e06b81c',    '1bedb2cc-fc6e-44c8-b95e-135624d12224',    'a73f8408-e93a-4fc2-b621-96937d345a73',    '9392be38-4337-407a-ac8c-305d257de7b6',    '268d976a-2060-426b-aa82-cd5b47d3b66b',    '8b5305e4-36eb-48fe-8606-b867ea9e56b5',    'fa6b59b2-f492-4a86-992c-3122bba762be',    '631f99e0-76c7-4082-b10e-d2e4c833bc1f',    '70835f72-5a46-4f0b-a8e1-7ef0c01d3443',    'c0545779-b537-4238-aa13-f965a5dc5fbb',    'ba720f9f-bc82-47a9-b6cf-1dcd2f245bdc',    '49c0157c-a135-4c3f-9180-9595917cab74',    '9796b1e8-bc8d-46ac-a3d5-d4df82d9968b',    '6c14e771-8048-4e7d-b80b-825bb38d54cb',    '55de73b0-f276-44d4-94d2-e2c3c0a649e9',    'ff36b0a9-67b9-42ec-a5ff-fc57e07a0630',    'e4240207-2cc6-4f54-b558-00ebe53a3b62',    'bb973944-b424-4fe9-b353-94e0b234836b',    '7c1431b4-1034-4cd5-a1d5-9d57ed162e70',    'b87cd5ad-c5cb-4299-bf53-de4ca398ffb1',    'ab45cc3d-168f-4e58-9b81-23fdf6bd5180'
);

-- End of seed data (batch 2)
