const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { assignLanes, getBooking, deleteBooking, getAllBookings, deleteBookingFromLanes, getAllBookedLanes, editBooking, getLaneNum, limitLanes } = require("../models/booking");
const { checkDateFormat, checkPlayerAndShoes, calcPrice } = require("../middleware/bookingMiddleware");

// GET all bookings from bookings table
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

// GET all booked lanes from lanes table
router.get("/bookedLanes", async (req, res) => {
  try {
    const allBookedLanes = await getAllBookedLanes();
    res.json({
      result: "Success",
      bookings: allBookedLanes,
      length: allBookedLanes.length,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Could not get booked lanes by booking id.",
    });
  }
});

// GET specific booking by bookingId
router.get("/", async (req, res) => {
  const { bookingId } = req.body;
  const booking = await getBooking(bookingId);
  console.log(booking);

  if (!booking) {
    res.json({ result: "Invalid booking ID." });
  } else {
    res.json({ result: "Booking found", booking: booking });
  }
});

// POST new booking
router.post("/", checkDateFormat, checkPlayerAndShoes, async (req, res) => {
  const { email, date, time, players, laneNum, shoeSizes } = req.body;
  const bookingId = uuidv4();

  const booked = await limitLanes(date, time);
  const calcRemainingLanes = 8 - booked.length;

  try {
    if (laneNum > 8) {
      res.json({ result: "You can't book more than 8 lanes." });
    } else if (booked.length + laneNum > 8) {
      res.json({
        result: "Not enough lanes available for this time slot.",
        lanesBooked: booked.length,
        lanesAvailable: calcRemainingLanes,
      });
    } else {
      assignLanes(date, time, laneNum, bookingId, email, players, shoeSizes);
      res.json({ result: "Booking successful.", bookingId: bookingId });
    }
  } catch (error) {
    res.json({ result: "Booking failed." });
  }
});

// EDIT booking, only players and shoe sizes
router.put("/edit", checkPlayerAndShoes, async (req, res) => {
  const { bookingId, players, shoeSizes } = req.body;
  const booking = await getBooking(bookingId);

  if (!booking) {
    res.json({ result: "Invalid booking ID." });
  } else if (booking) {
    const lanes = await getLaneNum(bookingId);
    const totalCost = await calcPrice(lanes, players);

    editBooking(bookingId, players, shoeSizes, lanes, totalCost);

    res.json({ result: "Booking edited for players and shoe sizes." });
  } else {
    res.json({ result: "Editing booking failed." });
  }
});

// EDIT full booking
router.put("/edit-full", checkDateFormat, checkPlayerAndShoes, async (req, res) => {
  const { bookingId, email, date, time, laneNum, players, shoeSizes } = req.body;
  const savedBookingId = req.body.bookingId;
  const booking = await getBooking(bookingId);
  const booked = await limitLanes(date, time);

  // calc new lanes remaining by - current laneNum in booking to allow for adding more lanes than before without going over 8 lanes total limit
  const calcNew = booked.length - booking.laneNum;
  const calcNew2 = calcNew + laneNum <= 8;

  if (!booking) {
    res.json({ result: "Invalid booking ID." });
  } else if (booking && calcNew2) {
    const del1 = await deleteBooking(bookingId);
    const del2 = await deleteBookingFromLanes(bookingId);
    const delMsg = del1.message == "deleted" && del2.message == "deleted";

    if (delMsg) {
      assignLanes(date, time, laneNum, savedBookingId, email, players, shoeSizes);

      res.json({ result: "Booking edited successfully!" });
    }
  } else {
    res.json({ result: "Failed to edit booking." });
  }
});

router.delete("/", async (req, res) => {
  const { bookingId } = req.body;
  const booking = await getBooking(bookingId);

  if (!booking) {
    res.json({ result: "Invalid booking ID." });
  } else {
    deleteBooking(bookingId);
    deleteBookingFromLanes(bookingId);
    res.json({ result: "Booking deleted" });
  }
});

module.exports = router;
