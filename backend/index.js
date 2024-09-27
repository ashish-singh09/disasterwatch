require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const auth = require("./routes/auth");
// const redisClient = require("./config/redis");
// const { initializeSocket } = require('./socket/socket');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const server = http.createServer(app);


// Initialize Socket.io
// initializeSocket(server);



// Api routes
app.use("/api/auth", auth);


//empty redis on server start
// redisClient.flushAll();

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started at port ${process.env.PORT || 3000}`);
});
