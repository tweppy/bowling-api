const moment = require("moment");

async function checkDateFormat(req, res, next) {
  const { date, time } = req.body;

  const parsedDate = moment(date, "YYYY-MM-DD", true);
  const parsedTime = moment(time, "HH:mm", true);

  const validDate = parsedDate.isValid() && parsedDate.format("YYYY-MM-DD") === date;
  const validTime = parsedTime.isValid() && parsedTime.format("HH:mm") === time;

  if (validDate && validTime) {
    next();
  } else {
    res.json({
      success: false,
      message: "Invalid time format. Please use 'YYYY-MM-DD' and 'HH:MM' formats. You can only book during full hour slots. Example: 2023-08-26 and 09:00.",
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
    console.log(players, shoeSizes.length);
  }
}

async function calcPrice(laneNum, players) {
  const lanePrice = 100;
  const playerPrice = 120;

  let totalLane = lanePrice * laneNum;
  let totalPeople = playerPrice * players;

  let totalCost = totalLane + totalPeople;
  console.log("totalLane, totalPeople, totalCost ", totalLane, totalPeople, totalCost);

  return totalCost;
}

module.exports = { checkDateFormat, checkPlayerAndShoes, calcPrice };
