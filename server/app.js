require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const api = require("./api/Api");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
require("./configs/Passport")(passport);
app.use("/api", api);

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

//Connect to mongoDB
mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database has connected");
    })
    .catch((err) => {
        console.log("Can't connect to database");
    });

// Listen PORT
server.listen(PORT);

// Socketio
require("./configs/SocketIO")(io);
