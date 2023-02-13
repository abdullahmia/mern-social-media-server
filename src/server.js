const app = require("./app");
const http = require("http");
const server = http.createServer(app);

// socket io connection
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

global.io = io;

// eslint-disable-next-line no-unused-vars
const db = require("./db/db");

require("dotenv").config({ path: `${__dirname}/../.env` });

// server configuration
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
