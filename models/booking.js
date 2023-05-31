const createDbConnection = require("./db");
const db = createDbConnection();
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

async function makeBooking(
  date,
  time,
  laneNum,
  bookingId,
  lanesStr,
  email,
  players,
  shoeSizes
) {
  const sizesStr = shoeSizes.join(", ");
  const totalCost = await calcPrice(laneNum, players);
  const insertQuery = `INSERT INTO bookings (date, time, laneNum, bookingId, lanes, email, players, price, shoeSizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(
    insertQuery,
    [
      date,
      time,
      laneNum,
      bookingId,
      lanesStr,
      email,
      players,
      totalCost,
      sizesStr,
    ],
    function (error) {
      if (error) {
        console.error("Error making booking:", error.message);
      } else {
        console.log("Booking made successfully with bookingId:", bookingId);
      }
    }
  );
}

async function assignLanes(
  date,
  time,
  laneNum,
  bookingId,
  email,
  players,
  shoeSizes
) {
  const query = `SELECT * FROM lanes WHERE date = ? AND time = ?`;
  let bookedLanes = [];
  let assignedLanes = [];
  const totalLanes = 8;

  db.all(query, [date, time], (error, rows) => {
    if (error) {
      console.log(error.message);
    } else {
      rows.forEach((row) => {
        // console.log("date:", row.date);
        bookedLanes = [...bookedLanes, row.laneId];

        console.log("unavailable lanes:", bookedLanes);
        // console.log("row.laneId", row.laneId);
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
      makeBooking(
        date,
        time,
        laneNum,
        bookingId,
        lanesStr,
        email,
        players,
        shoeSizes
      );
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

// LIMIT LANES
function limitLanes(date, time) {
  return new Promise((resolve, reject) => {
    const query = `SELECT date, time FROM lanes WHERE date = ? AND time = ?`;
    db.all(query, [date, time], (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

// price calc, move to middleware?
async function calcPrice(laneNum, players) {
  const lanePrice = 100;
  const playerPrice = 120;

  let totalLane = lanePrice * laneNum;
  let totalPeople = playerPrice * players;

  let totalCost = totalLane + totalPeople;
  console.log(
    "totalLane, totalPeople, totalCost ",
    totalLane,
    totalPeople,
    totalCost
  );

  return totalCost;
}

async function getAllBookings() {
  return new Promise((resolve, reject) => {
    const query = `SELECT bookingId from bookings`;
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

async function getBooking(bookingId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM bookings WHERE bookingId = ?`;
    db.get(query, [bookingId], (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

// DELETE FROM table
// WHERE search_condition;
async function deleteBooking(bookingId) {
  return new Promise((resolve, reject) => {
    const delQuery = `DELETE FROM bookings WHERE bookingId = ?`;
    db.run(delQuery, [bookingId], (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}

async function deleteBookingFromLanes(bookingId) {
  return new Promise((resolve, reject) => {
    const delQuery = `DELETE FROM lanes WHERE bookingId = ?`;
    db.run(delQuery, [bookingId], (error, rows) => {
      if (error) reject(error.message);
      else resolve(rows);
    });
  });
}


module.exports = {
  makeBooking,
  insertLanes,
  assignLanes,
  limitLanes,
  calcPrice,
  getBooking,
  deleteBooking,
  getAllBookings,
  deleteBookingFromLanes,
  getAllBookedLanes
};
