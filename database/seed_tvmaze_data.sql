-- Seed data from TVMaze API - 20 movies
-- Generated: 2026-06-21 21:26:33

-- 1. Breaking Bad
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('0a6b5c3b-116a-481a-accf-0ec83504bc44', 'Breaking Bad', 'Breaking Bad follows protagonist Walter White, a chemistry teacher who lives in New Mexico with his wife and teenage son who has cerebral palsy. White is diagnosed with Stage III cancer and given a prognosis of two years left to live. With a new sense of fearlessness based on his medical prognosi...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg', '2008-01-20', '2008-03-05', 'ACTIVE', 'Vince Gilligan', 'Bryan Cranston, Aaron Paul, Anna Gunn')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('0a6b5c3b-116a-481a-accf-0ec83504bc44', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('0a6b5c3b-116a-481a-accf-0ec83504bc44', 'b0000001-0000-0000-0000-000000000007'),    ('0a6b5c3b-116a-481a-accf-0ec83504bc44', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 2. Band of Brothers
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('b6c81b1c-ccf2-4679-9e27-2aba57adbc0e', 'Band of Brothers', 'Drawn from interviews with survivors of Easy Company, as well as their journals and letters, Band of Brothers chronicles the experiences of these men from paratrooper training in Georgia through the end of the war. As an elite rifle company parachuting into Normandy early on D-Day morning, partic...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/80/201679.jpg', '2001-09-09', '2001-10-24', 'ACTIVE', 'Steven Spielberg, Tom Hanks', 'Damian Lewis, Ron Livingston, Donnie Wahlberg')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('b6c81b1c-ccf2-4679-9e27-2aba57adbc0e', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('b6c81b1c-ccf2-4679-9e27-2aba57adbc0e', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 3. The Wire
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('fef3972a-82f4-4849-a5df-54fdb70f957e', 'The Wire', 'The first season of The Wire (2002) concentrated on the often-futile efforts of police to infiltrate a West Baltimore drug ring headed by Avon Barksdale and his lieutenant, Stringer Bell. In Seasons Two and Three, as the Barksdale investigation escalated, new storylines involving pressures on the...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/504/1260189.jpg', '2002-06-02', '2002-07-17', 'ACTIVE', 'David Simon', 'Dominic West, Idris Elba, Michael K. Williams')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('fef3972a-82f4-4849-a5df-54fdb70f957e', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('fef3972a-82f4-4849-a5df-54fdb70f957e', 'b0000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- 4. Game of Thrones
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('b8f13f77-4f35-42f1-a37c-e5f454c8362d', 'Game of Thrones', 'Based on the bestselling book series A Song of Ice and Fire by George R.R. Martin, this sprawling new HBO drama is set in a world where summers span decades and winters can last a lifetime. From the scheming south and the savage eastern lands, to the frozen north and ancient Wall that protects th...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg', '2011-04-17', '2011-06-01', 'ACTIVE', 'David Benioff, D.B. Weiss', 'Emilia Clarke, Kit Harington, Peter Dinklage')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('b8f13f77-4f35-42f1-a37c-e5f454c8362d', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('b8f13f77-4f35-42f1-a37c-e5f454c8362d', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('b8f13f77-4f35-42f1-a37c-e5f454c8362d', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 5. The Sopranos
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('936f99bc-6f36-4f56-8264-e6bffa42de0c', 'The Sopranos', 'The Sopranos, writer-producer-director David Chase''s extraordinary television series, is nominally an urban gangster drama, but its true impact strikes closer to home: Like 1999''s other screen touchstone, American Beauty, the HBO series chronicles a dysfunctional, suburban American family in bold...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/4/11341.jpg', '1999-01-10', '1999-02-24', 'ACTIVE', 'David Chase', 'James Gandolfini, Lorraine Bracco, Edie Falco')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('936f99bc-6f36-4f56-8264-e6bffa42de0c', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('936f99bc-6f36-4f56-8264-e6bffa42de0c', 'b0000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- 6. Sherlock
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('93e807d2-bc34-475a-9eec-e6c161f42ec0', 'Sherlock', 'Sherlock Holmes and Dr. John Watson''s adventures in 21st Century London. A thrilling, funny, fast-paced contemporary reimagining of the Arthur Conan Doyle classic.', 135, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/171/428042.jpg', '2010-07-25', '2010-09-08', 'ACTIVE', 'Steven Moffat, Mark Gatiss', 'Benedict Cumberbatch, Martin Freeman, Una Stubbs')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('93e807d2-bc34-475a-9eec-e6c161f42ec0', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('93e807d2-bc34-475a-9eec-e6c161f42ec0', 'b0000001-0000-0000-0000-000000000007'),    ('93e807d2-bc34-475a-9eec-e6c161f42ec0', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 7. Firefly
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('54bce757-15a7-4fd1-98da-c385297562f4', 'Firefly', 'Five hundred years in the future, a renegade crew aboard a small spacecraft tries to survive as they travel the unknown parts of the galaxy and evade warring factions as well as authority agents out to get them.', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/1/2600.jpg', '2002-09-20', '2002-11-04', 'ACTIVE', 'Joss Whedon', 'Nathan Fillion, Gina Torres, Alan Tudyk')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('54bce757-15a7-4fd1-98da-c385297562f4', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('54bce757-15a7-4fd1-98da-c385297562f4', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('54bce757-15a7-4fd1-98da-c385297562f4', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 8. Death Note
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('0d859656-a666-4fea-9eb2-f65ed635f070', 'Death Note', 'Death Note is an anime series based around a manga of the same name whereby a human finds a death god''s notebook. Any person''s name written in this notebook will die. The main character who finds this noteboook is Light Yagami who faces off against an unfaced character named L who tries to challe...', 80, 'Ti?ng Nh?t - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/499/1249019.jpg', '2006-10-03', '2006-11-17', 'ACTIVE', 'Tetsuro Araki', 'Mamoru Miyano, Brad Swaile, Shannon Chan-Kent')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('0d859656-a666-4fea-9eb2-f65ed635f070', '9d56ed24-3baa-417b-afa4-985f62bcfc4f'),    ('0d859656-a666-4fea-9eb2-f65ed635f070', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('0d859656-a666-4fea-9eb2-f65ed635f070', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 9. Avatar: The Last Airbender
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('a36cbecc-d783-451d-96c8-9f5aaa72bf65', 'Avatar: The Last Airbender', 'Water. Earth. Fire. Air. Only the Avatar was the master of all four elements. Only he could stop the ruthless Fire Nation from conquering the world. But when the world needed him most, he disappeared. Until now... On the South Pole, a lone Water Tribe village struggles to survive. It''s here that ...', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/79/199224.jpg', '2005-02-21', '2005-04-07', 'ACTIVE', 'Michael Dante DiMartino, Bryan Konietzko', 'Zach Tyler Eisen, Mae Whitman, Jack DeSena')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('a36cbecc-d783-451d-96c8-9f5aaa72bf65', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('a36cbecc-d783-451d-96c8-9f5aaa72bf65', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 10. Gravity Falls
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('ed87a8b5-5560-4722-80ef-299b6ce58e1b', 'Gravity Falls', 'Twin brother and sister Dipper and Mabel Pines are in for an unexpected adventure when they spend the summer with their great Uncle in the mysterious town of Gravity Falls, Oregon.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/2/6140.jpg', '2012-06-15', '2012-07-30', 'ACTIVE', 'Alex Hirsch', 'Jason Ritter, Kristen Schaal, Alex Hirsch')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('ed87a8b5-5560-4722-80ef-299b6ce58e1b', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('ed87a8b5-5560-4722-80ef-299b6ce58e1b', '649b127c-61ff-43fc-af78-296ab910d1f5')
ON CONFLICT DO NOTHING;

-- 11. Person of Interest
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('78169957-79a6-400f-93e7-79edb56ed89a', 'Person of Interest', 'You are being watched. The government has a secret system, a machine that spies on you every hour of every day. I know because I built it. I designed the Machine to detect acts of terror but it sees everything. Violent crimes involving ordinary people. People like you. Crimes the government consi...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/163/407679.jpg', '2011-09-22', '2011-11-06', 'ACTIVE', 'Jonathan Nolan', 'Jim Caviezel, Michael Emerson, Taraji P. Henson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('78169957-79a6-400f-93e7-79edb56ed89a', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('78169957-79a6-400f-93e7-79edb56ed89a', 'b0000001-0000-0000-0000-000000000007'),    ('78169957-79a6-400f-93e7-79edb56ed89a', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 12. Stargate Atlantis
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('5775cd1f-6b63-414a-be70-cfde1fc75458', 'Stargate Atlantis', 'Atlantis, built thousands of years ago by the highly evolved Ancients, is home base for an elite expedition from Earth. These courageous military commanders and scientists leap through the city''s Stargate to explore the wondrous Pegasus galaxy and battle the treacherous Wraith, who seek control o...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245482.jpg', '2004-07-16', '2004-08-30', 'ACTIVE', 'Brad Wright, Robert C. Cooper', 'Joe Flanigan, Torri Higginson, Rainbow Sun Francks')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('5775cd1f-6b63-414a-be70-cfde1fc75458', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('5775cd1f-6b63-414a-be70-cfde1fc75458', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 13. Stargate SG�1
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('6817a704-f3d9-4595-90c4-9fd525c12220', 'Stargate SG�1', 'Stargate SG-1 is a science fiction series based on the original film Stargate. It involves the team SG-1 going on various adventures to different alien worlds through Stargates. Throughout the series they encounter various alien threats and allies including but not limited to the Goa''uld and the ...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/1/3027.jpg', '1997-07-27', '1997-09-10', 'ACTIVE', 'Brad Wright, Jonathan Glassner', 'Richard Dean Anderson, Michael Shanks, Amanda Tapping')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('6817a704-f3d9-4595-90c4-9fd525c12220', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('6817a704-f3d9-4595-90c4-9fd525c12220', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 14. Downton Abbey
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('1004802d-2109-421e-b9bf-42884004ecac', 'Downton Abbey', 'The Downton Abbey estate stands a splendid example of confidence and mettle, its family enduring for generations and its staff a well-oiled machine of propriety. But change is afoot at Downton--change far surpassing the new electric lights and telephone. A crisis of inheritance threatens to displ...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/1/4601.jpg', '2010-09-26', '2010-11-10', 'ACTIVE', 'Julian Fellowes', 'Hugh Bonneville, Michelle Dockery, Maggie Smith')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('1004802d-2109-421e-b9bf-42884004ecac', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('1004802d-2109-421e-b9bf-42884004ecac', '9d56ed24-3baa-417b-afa4-985f62bcfc4f')
ON CONFLICT DO NOTHING;

-- 15. Oz
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('c8db6918-612f-4234-a264-5677a89fa292', 'Oz', 'HBO''s violent men-behind-bars drama is an addictive, testosterone-driven soap opera for guys. The eight episodes of the first season set the style for the show: a massive cast of a vivid characters on both sides of the bars, four or five stories unleashed at a breakneck pace and framed by angry, ...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/6/15172.jpg', '1997-07-12', '1997-08-26', 'ACTIVE', 'Tom Fontana', 'Lee Tergesen, Kirk Acevedo, Ernie Hudson')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('c8db6918-612f-4234-a264-5677a89fa292', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('c8db6918-612f-4234-a264-5677a89fa292', 'b0000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- 16. Deadwood
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('dc5dd4cb-cb3a-423a-84b5-ab2ccd85d554', 'Deadwood', 'The outlaw camp of Deadwood marches slowly towards civilization, facing its first elections. But the power struggles continue over everything in Deadwood�influence, money, and whores�as the founding camp members form strategic alliances to face down the threat of a powerful newcomer, seeking to r...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/4/11724.jpg', '2004-03-21', '2004-05-05', 'ACTIVE', 'David Milch', 'Timothy Olyphant, Ian McShane, Molly Parker')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('dc5dd4cb-cb3a-423a-84b5-ab2ccd85d554', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('dc5dd4cb-cb3a-423a-84b5-ab2ccd85d554', 'b0000001-0000-0000-0000-000000000007'),    ('dc5dd4cb-cb3a-423a-84b5-ab2ccd85d554', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 17. Battlestar Galactica
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('b87e4d76-a9bb-4af8-b9a1-649121ceeea1', 'Battlestar Galactica', 'The world ended with no warning, and all that was left� was hope.A truce between the humans of the Twelve Colonies and the Cylons�intelligent robots designed by humankind�lasts for 40 tense and silent years. Battlestar Galactica picks up just as the Cylons commit mass genocide against humanity. O...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2313.jpg', '2003-12-08', '2004-01-22', 'ACTIVE', 'Ronald D. Moore', 'Edward James Olmos, Mary McDonnell, Katee Sackhoff')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('b87e4d76-a9bb-4af8-b9a1-649121ceeea1', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('b87e4d76-a9bb-4af8-b9a1-649121ceeea1', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf'),    ('b87e4d76-a9bb-4af8-b9a1-649121ceeea1', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 18. Justified
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('d123ff46-fa4e-474f-8eef-bb563d776c6c', 'Justified', 'Deputy U.S. Marshal Raylan Givens is something of a 19th century-style officer in modern times, whose unconventional enforcement of justice makes him a target with criminals and a problem for his superiors in the U.S. Marshals Service. As a result of an eager but "justified" shooting of a Miami f...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T16', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/0/808.jpg', '2010-03-16', '2010-04-30', 'ACTIVE', 'Graham Yost', 'Timothy Olyphant, Walton Goggins, Joelle Carter')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('d123ff46-fa4e-474f-8eef-bb563d776c6c', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('d123ff46-fa4e-474f-8eef-bb563d776c6c', 'b0000001-0000-0000-0000-000000000007'),    ('d123ff46-fa4e-474f-8eef-bb563d776c6c', '5bd179a4-6292-4424-8dda-56d3f2f40152')
ON CONFLICT DO NOTHING;

-- 19. Rick and Morty
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('50b00ea6-c852-4d5f-9789-a11d9883aabf', 'Rick and Morty', 'Rick is a mentally gifted, but sociopathic and alcoholic scientist and a grandfather to Morty; an awkward, impressionable, and somewhat spineless teenage boy. Rick moves into the family home of Morty, where he immediately becomes a bad influence.', 80, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'P', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/626/1566363.jpg', '2013-12-02', '2014-01-16', 'ACTIVE', 'Dan Harmon, Justin Roiland', 'Justin Roiland, Chris Parnell, Spencer Grammer')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('50b00ea6-c852-4d5f-9789-a11d9883aabf', 'ad0d02bc-a632-4113-bde7-5e4f6fe4edf6'),    ('50b00ea6-c852-4d5f-9789-a11d9883aabf', '5bd179a4-6292-4424-8dda-56d3f2f40152'),    ('50b00ea6-c852-4d5f-9789-a11d9883aabf', '1cc4d0e1-6465-4b62-ba55-acfbe63d13cf')
ON CONFLICT DO NOTHING;

-- 20. House
INSERT INTO movies (movie_id, title, description, duration, language, language_display, age_rating, trailer_url, poster_url, showing_start_date, showing_end_date, status, director, actors) VALUES
    ('a846d2f2-9a3d-4616-a52b-94759569f8ac', 'House', 'Sink your teeth into meaty drama and intrigue with House, FOX''s take on mystery, where the villain is a medical malady and the hero is an irreverent, controversial doctor who trusts no one, least of all his patients.Dr. Gregory House is a maverick physician who is devoid of bedside manner. While ...', 90, 'Ti?ng Anh - Ph? d? Ti?ng Vi?t', 'T13', NULL, 'https://static.tvmaze.com/uploads/images/medium_portrait/357/894990.jpg', '2004-11-16', '2004-12-31', 'ACTIVE', 'David Shore', 'Hugh Laurie, Robert Sean Leonard, Jennifer Morrison')
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id) VALUES
    ('a846d2f2-9a3d-4616-a52b-94759569f8ac', '1a409ed9-2b35-40b0-b677-14485b3c3db9'),    ('a846d2f2-9a3d-4616-a52b-94759569f8ac', '649b127c-61ff-43fc-af78-296ab910d1f5'),    ('a846d2f2-9a3d-4616-a52b-94759569f8ac', 'b0000001-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- End of seed data
