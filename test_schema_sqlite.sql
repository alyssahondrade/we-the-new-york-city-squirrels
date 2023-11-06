CREATE TABLE location (
    squirrel_id VARCHAR(20) PRIMARY KEY,
    latitude FLOAT(20),
    longitude FLOAT(20)
);

CREATE TABLE appearance (
    squirrel_id VARCHAR(20) PRIMARY KEY,
    primary_colour VARCHAR(10),
    black BOOL,
    cinnamon BOOL,
    gray BOOL,
    white BOOL
);

CREATE TABLE activities (
    squirrel_id VARCHAR(20) PRIMARY KEY,
    chasing BOOL,
    climbing BOOL,
    digging BOOL,
    eating BOOL,
    foraging BOOL,
    running BOOL,
    shouting BOOL,
    sitting BOOL
);

CREATE TABLE interactions (
    squirrel_id VARCHAR(20) PRIMARY KEY,
    approaches BOOL,
    indifferent BOOL,
    runs_from BOOL,
    watching BOOL
);