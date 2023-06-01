const createDbConnection = require("./db");
const db = createDbConnection();
const { calcPrice } = require("../middleware/bookingMiddleware");

function limitLanes(date, time) {
  return new Promise((resolve, reject) => {
    const query = `SELECT date, time FROM lanes WHERE date = ? AND time = ?`;
    db.all(query, [date, time], (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

// GET
async function getBooking(bookingId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM bookings WHERE bookingId = ?`;
    db.get(query, [bookingId], (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

async function getAllBookings() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from bookings`;
    db.all(query, (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

async function getAllBookedLanes() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from lanes`;
    db.all(query, (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

async function getLaneNum(bookingId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT laneNum FROM bookings WHERE bookingId = ?`;
    db.get(query, [bookingId], (error, row) => {
      if (error) reject(error.message);
      else resolve(row.laneNum);
    });
  });
}

// POST

async function assignLanes(date, time, laneNum, bookingId, email, players, shoeSizes) {
  const query = `SELECT * FROM lanes WHERE date = ? AND time = ?`;
  let bookedLanes = [];
  let assignedLanes = [];
  const totalLanes = 8;

  db.all(query, [date, time], (error, rows) => {
    if (error) {
      console.log(error.message);
    } else {
      rows.forEach((row) => {
        bookedLanes = [...bookedLanes, row.laneId];
        console.log("unavailable lanes:", bookedLanes);
      });

      for (let i = 1; i <= totalLanes; i++) {
        const lanesAreBooked = bookedLanes.includes(i);
        const validNumLanes = laneNum > assignedLanes.length;

        if (!lanesAreBooked && validNumLanes) {
          assignedLanes.push(i);
        }
      }

      console.log("assigned lanes:", assignedLanes);
      const lanesStr = assignedLanes.join(", ");

      insertLanes(assignedLanes, date, time, bookingId);
      createBooking(date, time, laneNum, bookingId, lanesStr, email, players, shoeSizes);
    }
  });
}

async function createBooking(date, time, laneNum, bookingId, lanesStr, email, players, shoeSizes) {
  const sizesStr = shoeSizes.join(", ");
  const totalCost = await calcPrice(laneNum, players);
  const insertQuery = `INSERT INTO bookings (date, time, laneNum, bookingId, lanes, email, players, price, shoeSizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(insertQuery, [date, time, laneNum, bookingId, lanesStr, email, players, totalCost, sizesStr], function (error) {
    if (error) {
      console.error("Error making booking:", error.message);
    } else {
      console.log("Booking made successfully with bookingId:", bookingId);
    }
  });
}

function insertLanes(assignedLanes, date, time, bookingId) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO lanes (laneId, date, time, bookingId) VALUES (?, ?, ?, ?)`;
    assignedLanes.forEach((lane) => {
      db.run(query, [lane, date, time, bookingId], (error) => {
        if (error) reject(error.message);
        else resolve(true);
      });
    });
  });
}

// EDIT
async function editBooking(bookingId, players, shoeSizes, laneNum, totalCost) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE bookings SET shoeSizes = ?, players = ?, price = ? WHERE bookingId = ?`;
    const sizesStr = shoeSizes.join(", ");
    db.run(query, [sizesStr, players, totalCost, bookingId], (error) => {
      if (error) reject(error.message);
      else resolve(true);
    });
  });
}

// DELETE
async function deleteBooking(bookingId) {
  return new Promise((resolve, reject) => {
    const delQuery = `DELETE FROM bookings WHERE bookingId = ?`;
    db.run(delQuery, [bookingId], (error, rows) => {
      if (error) reject(error.message);
      else resolve({ message: "deleted" });
    });
  });
}

async function deleteBookingFromLanes(bookingId) {
  return new Promise((resolve, reject) => {
    const delQuery = `DELETE FROM lanes WHERE bookingId = ?`;
    db.run(delQuery, [bookingId], (error, rows) => {
      if (error) reject(error.message);
      else resolve({ message: "deleted" });
    });
  });
}

module.exports = {
  limitLanes,
  getBooking,
  getAllBookings,
  getAllBookedLanes,
  getLaneNum,
  assignLanes,
  createBooking,
  insertLanes,
  editBooking,
  deleteBooking,
  deleteBookingFromLanes,
};
