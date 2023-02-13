const app = require("./app");
const http = require("http");
const server = http.createServer(app);

// eslint-disable-next-line no-unused-vars
const db = require("./db/db");

require("dotenv").config({ path: `${__dirname}/../.env` });

// socket io connection
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

global.io = io;

// server configuration
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
