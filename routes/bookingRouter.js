const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { createBooking } = require("../models/booking");
const { checkBooking, checkFormats } = require("../middleware/bookingMiddleware");

router.get("/", (req, res) => {});

router.post("/", checkFormats, checkBooking, (req, res) => {
  const bookingId = uuidv4();
  const { email, date, time, players, laneId, shoeSizes } = req.body;

  createBooking(bookingId, email, date, time, players, laneId, shoeSizes)
    .then(() => {
      res.json({ msg: "added" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to create booking." });
    });
});

router.put("/", (req, res) => {});

router.delete("/", (req, res) => {});

module.exports = router;

/*
	"email": "",
	"date": "",
	"time": "",
	"players": "",
	"lanesNum": "",
	"shoeSizes": ""
*/

/*
for laneId:
then check that laneId at time && date IS NOT booked already
*/
