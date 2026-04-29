require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const httpStatus = require("./utils/httpStatus");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const port = process.env.PORT || 5000;
const URL = process.env.MONGO_URL;
const { Server } = require("socket.io");
const http = require("http");
let visitorCount = 0;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// app.use("/api", limiter);
app.use("/api/plans", require("./routes/plan.route"));
app.use("/api/auth", require("./routes/user.route"));
app.use("/api/pay", require("./routes/pay.route"));
app.use("/api/webhook", require("./routes/webhook.route"));
app.use("/api/card", require("./routes/card.route"));
app.use("/api/analysis", require("./routes/analysis.route"));
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || httpStatus.ERROR,
    message: err.message || "Something went wrong",
    code: err.statusCode || 500,
  });
});

io.on("connection", (socket) => {
  visitorCount++;
  io.emit("visitor", visitorCount);
  socket.on("disconnect", () => {
    visitorCount--;
    io.emit("visitor", visitorCount);
  });
});
mongoose
  .connect(URL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("Error DB =>", err.message));

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
