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
      bookingId TEXT,
      email TEXT,
      date TEXT,
      time TEXT,
      players INTEGER,
      laneNum INTEGER,
      lanes TEXT,
      price INTEGER,
      shoeSizes INTEGER
    );

    CREATE TABLE IF NOT EXISTS lanes (
      ID INTEGER PRIMARY KEY AUTOINCREMENT, 
      laneId,
      date TEXT, 
      time TEXT,
      bookingId TEXT,
      FOREIGN KEY (bookingId) REFERENCES bookings(bookingId)
    );


  `);
}


module.exports = createDbConnection;
