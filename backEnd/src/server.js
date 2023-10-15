// require("dotenv").config();
const express = require("express");
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
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});
// const activeUsers = [];
// // const idToSocket = {};
// io.on("connection", (socket) => {
//   console.log("user connected: " + socket.id);

//   socket.on("set_id", (id) => {
//     user = {
//       id: id,
//       socket: socket.id,
//     };
//     activeUsers.push(user);
//     io.emit("data", activeUsers); // Gửi danh sách người dùng kích hoạt đến tất cả các client
//   });

//   socket.on("disconnect", () => {
//     console.log("người dùng k online" + socket.id);
//   });
// });

// });
// -----------------------
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static("public"));
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Thay đổi thành nguồn gốc của you
//   })
// );

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
