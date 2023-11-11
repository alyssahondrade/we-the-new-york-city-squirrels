CREATE TABLE location (
    PRIMARY KEY (squirrel_id),
    squirrel_id VARCHAR(20),
    latitude FLOAT(20),
    longitude FLOAT(20)
);

CREATE TABLE appearance (
    PRIMARY KEY (squirrel_id),
    squirrel_id VARCHAR(20),
    primary_colour VARCHAR(10),
    black BOOL,
    cinnamon BOOL,
    gray BOOL,
    white BOOL
);

CREATE TABLE activities (
    PRIMARY KEY (squirrel_id),
    squirrel_id VARCHAR(20),
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
    PRIMARY KEY (squirrel_id),
    squirrel_id VARCHAR(20),
    approaches BOOL,
    indifferent BOOL,
    runs_from BOOL,
    watching BOOL
);