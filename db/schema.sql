DROP DATABASE IF EXISTS user_db;
CREATE DATABASE user_db;

\c user_db;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  movie_name VARCHAR(100) NOT NULL
  book_name VARCHAR(100) NOT NULL
  tv_show_name VARCHAR(100) NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    movie_id INT,
    review TEXT NOT NULL,
    FOREIGN KEY (movie_id)
    REFERENCES movies(id)
    ON DELETE SET NULL
);
