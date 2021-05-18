DROP DATABASE IF EXISTS all_pets;

CREATE DATABASE all_pets;

\c all_pets


CREATE TABLE all_pets(
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL, 
    kind TEXT,
    age INTEGER
    );

INSERT INTO properties (name, kind, age) VALUES ('Simor', 'Pup', 4);