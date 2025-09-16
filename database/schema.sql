CREATE DATABASE IF NOT EXISTS game_1942;
USE game_1942;

-- Eliminar tabla si existe para recrearla con la nueva estructura
DROP TABLE IF EXISTS scores;

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    initials CHAR(3) NOT NULL UNIQUE,  -- UNIQUE constraint para evitar duplicados
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_score ON scores (score DESC);

SELECT * FROM scores ORDER BY score DESC;


---------------------------------------------------------

CREATE TABLE couples_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player1_initials VARCHAR(3) NOT NULL,
  player1_score INT NOT NULL,
  player2_initials VARCHAR(3) NOT NULL,
  player2_score INT NOT NULL,
  total_score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);