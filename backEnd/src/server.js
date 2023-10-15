// require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");
const configViewEngine = require("./config/viewEngine");
const webRoutes = require("./routes/web");
const api = require("./routes/api");
const postApi = require("./routes/postApi");
const groups = require("./routes/groupApi");
const connection = require("./config/database");
const session = require("express-session");
const messenger = require("./routes/messengerApi");
const adminApi = require("./routes/adminApi");
const app = express();
// ---------------------------
// const http = require("http");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
let activeUsers = [];
io.on("connection", (socket) => {
  socket.on("add_new_user", (newUserID) => {
    if (!activeUsers.some((user) => user.userId === newUserID)) {
      activeUsers.push({
        userId: newUserID,
        socketId: socket.id,
      });
      console.log(activeUsers);
    }
    console.log("user connect: " + activeUsers);
    io.emit("get_user", activeUsers);
  });
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("user disconnect: " + activeUsers);
    io.emit("get_user", activeUsers);
  });
});

// });
// -----------------------
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

app.use(
  session({
    secret: "tamle23122004bmT!@#",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
    }, // Nếu sử dụng HTTPS, đặt secure: true
  })
);

configViewEngine(app);

app.use("/", webRoutes);

// api account
app.use("/account", api);
// api post
app.use("/post", postApi);

app.use("/groups", groups);

app.use("/messenger", messenger);

app.use("/admin", adminApi);

server.listen(port, () => {
  console.log(`Sever app listening on port ${port}`);
});
