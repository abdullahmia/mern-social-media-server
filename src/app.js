const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// internal imports
const routes = require("./routes/index");

// middlewares
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route middleware
app.use("/api", routes);

module.exports = app;
