const createDbConnection = require("./db");
const db = createDbConnection();
const { v4: uuidv4 } = require("uuid");

function createBooking(
  bookingId,
  email,
  date,
  time,
  players,
  laneId,
  shoeSizes
) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO bookings (bookingId, email, date, time, players, laneId, shoeSizes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, email, date, time, players, laneId, shoeSizes],
      (error) => {
        if (error) reject(error.message);
        else resolve(true);
      }
    );
  });
}

// check all 3
function checkAvailabilty(date, time, laneId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT date, time, laneId FROM bookings WHERE date = ? AND time = ? AND laneId = ?`,
      [date, time, laneId],
      (error, row) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(!!row);
        }
      }
    );
  });
}

module.exports = { createBooking, checkAvailabilty };
