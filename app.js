const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const connectToDb = require('./models/db');

// routers
const bookingRouter = require("./routes/bookingRouter");

app.use(express.json());

// routers use
app.use("/api/booking", bookingRouter)

app.listen(PORT, () => {
  console.log("Server started");
  connectToDb();
});

// try {
//   createDbConnection();
//   console.log("Database connected");

//   app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
//   });
// } catch (error) {
//   console.log("Failed to connect to the database:", error);
// }
