DROP TABLE squirrel_data_2018;

--create squirrel_data_2018 table

CREATE TABLE squirrel_data_2018 (
	squirrel_longitude FLOAT NOT NULL,
	squirrel_latitude FLOAT NOT NULL,
	squirrel_id VARCHAR(20) NOT NULL,
	date DATE NOT NULL,
	age VARCHAR(20),
	primary_fur_color VARCHAR(30),
	highlight_fur_color VARCHAR(30),
	running BOOLEAN NOT NULL,
	chasing BOOLEAN NOT NULL,
	climbing BOOLEAN NOT NULL,
	eating BOOLEAN NOT NULL,
	foraging BOOLEAN NOT NULL,
	other_activities VARCHAR(50),
	approaches BOOLEAN NOT NULL,
	indifferent BOOLEAN NOT NULL,
	runs_from BOOLEAN NOT NULL,
	other_interactions VARCHAR(100),
	lat/long VARCHAR(100) NOT NULL,
	shouting VARCHAR(50) NOT NULL,
	PRIMARY KEY(squirrel_id)
);

--import squirrel_data_2018 data

--create squirrel_data_2020 table

CREATE TABLE park_data_2020 (
	park_name VARCHAR(100),
	park_id INT NOT NULL,
	squirrel_id VARCHAR(20) NOT NULL,
	primary_fur_color VARCHAR(30) NOT NULL,
	highlights_in_fur_color VARCHAR(30) NOT NULL,
	activities VARCHAR(50) NOT NULL,
	interactions_with_humans VARCHAR(30) NOT NULL,
	other_notes_or_observations VARCHAR(80),
	squirrel_latitude FLOAT NOT NULL,
	squirrel_longitude FLOAT NOT NULL,
	PRIMARY KEY(park_id)
);

--import squirrel_data_2020 data

--create park_data_2020 table

