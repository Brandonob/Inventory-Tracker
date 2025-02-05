DROP DATABASE IF EXISTS pook_inventory;
CREATE DATABASE pook_inventory;

\c pook_inventory;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users(
    id VARCHAR PRIMARY KEY,
    userName VARCHAR,
    password VARCHAR
);

CREATE TABLE products(
    id VARCHAR PRIMARY KEY,
    name TEXT NOT NULL,
    price BIGINT DEFAULT 0
);