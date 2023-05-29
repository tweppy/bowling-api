const { checkAvailabilty } = require("../models/booking");

// check available booking slot
async function checkBooking(req, res, next) {
  const { date, time, laneId } = req.body;
  const booked = await checkAvailabilty(date, time, laneId);

  // if not booked, add
  if (!booked) {
    next();
  } else {
    res.json({
      success: false,
      message: "Unavailable booking slot",
    });
  }
}

// date and time format CHECK
async function checkFormats(req, res, next) {
  const { date, time } = req.body;

  console.log(date.length, time.length)

  // check moment.js

  if (date && time) {
    next();
  } else {
    res.json({
      success: false,
      message: "Invalid time format. Please use 'DD/MM/YYYY' and 'TT:00' formats. Example: 05/08/2023 and 09:00.",
    });
  }
}

async function checkBody(req, res, next) {
    // req.body:
    const { players, laneId, shoeSizes } = req.body;

    //haven't created these fns yet OOop
    // how to when boooking multiple lanes tho?
    const validLaneNumber = await validLane(laneId) // 1-8, match ids in db

    const validPlayersAndShoes = shoeSizes.length === players


    // laneIdArray.length * 6 (for max 6 people per lane)
}

module.exports = { checkBooking, checkFormats };
