const { checkAvailabilty, limitLanes } = require("../models/booking");
const moment = require("moment");

// date and time format CHECK
async function checkDateFormat(req, res, next) {
  const { date, time } = req.body;

  const parsedDate = moment(date, "YYYY-MM-DD", true);
  const parsedTime = moment(time, "HH:mm", true);

  const validDate =
    parsedDate.isValid() && parsedDate.format("YYYY-MM-DD") === date;
  const validTime = parsedTime.isValid() && parsedTime.format("HH:mm") === time;

  if (validDate && validTime) {
    next();
  } else {
    res.json({
      success: false,
      message:
        "Invalid time format. Please use 'YYYY-MM-DD' and 'HH:MM' formats. You can only book during full hour slots. Example: 2023-08-26 and 09:00.",
    });
  }
}

async function checkPlayerAndShoes(req, res, next) {
  const { players, shoeSizes } = req.body;

  const validPlayersAndShoes = shoeSizes.length === players;

  if (validPlayersAndShoes) {
    next();
  } else {
    res.json({
      msg: "Invalid input. Please make sure each player has a shoe size.",
    });
  }
}

async function checkLaneLimit(req, res, next) {
  const { date, time, laneNum } = req.body;
  const howMany = await limitLanes(date, time);
  const calcRemainingLanes = 8 - howMany.length;

  // user writes more htan 8 lanes
  if (laneNum > 8) {
    res.json({ msg: "You can't book more than 8 lanes." });
  }
  // what is booked + laneNUm EXCEEDS 8
  else if (howMany.length + laneNum > 8) {
    res.json({
      msg: "Not enough lanes available for this time slot.",
      lanesBooked: howMany.length,
      lanesAvailable: calcRemainingLanes,
    });
  } else {
    next(); // what is booked + laneNum does not exceed 8
  }
}

module.exports = { checkDateFormat, checkPlayerAndShoes, checkLaneLimit };
