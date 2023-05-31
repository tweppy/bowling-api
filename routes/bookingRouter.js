const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const {
  assignLanes,
  getBooking,
  deleteBooking,
  getAllBookings,
  deleteBookingFromLanes,
  getAllBookedLanes
} = require("../models/booking");
const {
  checkDateFormat,
  checkPlayerAndShoes,
  checkLaneLimit,
} = require("../middleware/bookingMiddleware");

router.get("/allBookings", async (req, res) => {
  try {
    const allBookings = await getAllBookings();
    res.json({
      result: "Success",
      bookings: allBookings,
      length: allBookings.length,
    });
  } catch (error) {
    res.json({ success: false, message: "Could not get bookings." });
  }
});

router.get("/bookedLanes", async (req, res) => {
  try {
    const allBookedLanes = await getAllBookedLanes();
    res.json({
      result: "Success",
      bookings: allBookedLanes,
      length: allBookedLanes.length,
    });
  } catch (error) {
    res.json({ success: false, message: "Could not get booked lanes by booking id." });
  }
});

router.get("/", async (req, res) => {
  const { bookingId } = req.body;
  const booking = await getBooking(bookingId);
  console.log(booking)

  if (!booking) {
    res.json({ result: "Invalid booking ID." });
  } else {
    res.json({ result: "Booking found", booking: booking });
  }
});

// done
router.post(
  "/",
  checkDateFormat,
  checkPlayerAndShoes,
  checkLaneLimit,
  async (req, res) => {
    const { email, date, time, players, laneNum, shoeSizes } = req.body;
    const bookingId = uuidv4();

    try {
      assignLanes(date, time, laneNum, bookingId, email, players, shoeSizes);
      res.json({ msg: "Booking successful.", bookingId: bookingId });
    } catch (error) {
      res.json({ msg: "Booking failed." });
    }
  }
);

router.put("/", (req, res) => {});

// done
router.delete("/", async (req, res) => {
  const { bookingId } = req.body;
  const booking = await getBooking(bookingId);

  if (!booking) {
    res.json({ result: "Invalid booking ID." });
  } else {
    // del from BOOKINGS:
    deleteBooking(bookingId);

    // DEL FROM LANES:
    deleteBookingFromLanes(bookingId)
    // res.json:
    res.json({ result: "Booking deleted" });
  }
});

module.exports = router;

// rename:
// assignLanes ?
// makeBooking
