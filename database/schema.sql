CREATE DATABASE IF NOT EXISTS game_1942;
USE game_1942;

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    initials CHAR(3) NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_score ON scores (score DESC);
CREATE INDEX idx_initials ON scores (initials);