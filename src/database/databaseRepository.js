import { db } from './index';

export const getTracks = () => {
  return db.getAllSync('SELECT * FROM tracks;');
};

export const insertTrack = (title, fileName, artist) => {
  return db.runSync(
    'INSERT INTO tracks (title, fileName, artist) VALUES (?, ?, ?);', 
    [title, fileName, artist]
  );
};

export const deleteTrack = (id) => {
  return db.runSync('DELETE FROM tracks WHERE id = ?;', [id]);
};