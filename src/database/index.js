import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('meu_app.db');

export const setupDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      fileName TEXT NOT NULL
    );
  `);
};

export const feedInitialData = () => {
  db.execSync(
    `
      INSERT INTO tracks (title, fileName, artist) VALUES ("R U Mine", "02 - R U Mine_.mp3", "Arctic Monkeys");
      INSERT INTO tracks (title, fileName, artist) VALUES ("I Bet You Look Good On The Dancefloor", "I Bet You Look Good On The Dancefloor.mp3", "Arctic Monkeys");
      INSERT INTO tracks (title, fileName, artist) VALUES ("505", "12 505.mp3", "Arctic Monkeys");
      INSERT INTO tracks (title, fileName, artist) VALUES ("No. 1 Party Anthem", "06 - No. 1 Party Anthem.mp3", "Arctic Monkeys");
      INSERT INTO tracks (title, fileName, artist) VALUES ("Fluorescent Adolescent", "05 Fluorescent Adolescent.mp3", "Arctic Monkeys");
    `
  )
}