const sqlite3 = require("sqlite3").verbose();

function createDbConnection() {
  const db = new sqlite3.Database("./bowling.sqlite", (error) => {
    if (error) return console.log(error.message);
    createTable(db);
  });

  return db;
}

function createTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      bookingId TEXT NOT NULL,
      email TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      players INTEGER NOT NULL,
      laneId INTEGER NOT NULL,
      shoeSizes TEXT NOT NULL,
      FOREIGN KEY (laneId) REFERENCES lanes(laneId)
    );

    CREATE TABLE IF NOT EXISTS lanes (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      laneId INTEGER NOT NULL
    );

    INSERT INTO lanes(id, laneId) 
    SELECT 1, 1 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 1 AND laneId = 1);

    INSERT INTO lanes(id, laneId) 
    SELECT 2, 2 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 2 AND laneId = 2);

    INSERT INTO lanes(id, laneId) 
    SELECT 3, 3 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 3 AND laneId = 3);

    INSERT INTO lanes(id, laneId) 
    SELECT 4, 4 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 4 AND laneId = 4);

    INSERT INTO lanes(id, laneId) 
    SELECT 5, 5 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 5 AND laneId = 5);

    INSERT INTO lanes(id, laneId) 
    SELECT 6, 6 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 6 AND laneId = 6);

    INSERT INTO lanes(id, laneId) 
    SELECT 7, 7 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 7 AND laneId = 7);

    INSERT INTO lanes(id, laneId) 
    SELECT 8, 8 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 8 AND laneId = 8);

  `);
}

/*
    INSERT INTO lanes(id, laneId) 
    SELECT 23, 'text to insert' 
    WHERE NOT EXISTS(SELECT 1 FROM lanes WHERE id = 23 AND laneId = 'text to insert');
*/

/*
    CREATE TABLE IF NOT EXISTS lanes (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      channelId TEXT NOT NULL,
      channelName TEXT NOT NULL,
      FOREIGN KEY (username) REFERENCES user(username)


            laneId INTEGER NOT NULL,
      FOREIGN KEY (laneId) REFERENCES lanes(laneId)
    );

*/

module.exports = createDbConnection;
