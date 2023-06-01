const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const connectToDb = require("./models/db");
const bookingRouter = require("./routes/bookingRouter");

app.use(express.json());

app.use("/api/booking", bookingRouter);

app.listen(PORT, () => {
  console.log("Server started");
  connectToDb();
});
