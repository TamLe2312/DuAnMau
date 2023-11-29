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
const notification = require("./routes/notificationApi");
const app = express();
const callEnd = require("./routes/callvideoApi");
// ---------------------------
// const http = require("http");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let activeUsers = [];
io.on("connection", (socket) => {
  socket.on("add_new_user", (newUserID) => {
    const userExists = activeUsers.some((user) => user.userId === newUserID);
    if (!userExists) {
      activeUsers.push({
        userId: newUserID,
        socketId: socket.id,
      });
      console.log("Người online:", activeUsers);
      io.emit("get_user", activeUsers);
    }
  });
  // --------------------
  // ------------------
  socket.on("add_message", (data) => {
    const { youID, myID } = data;
    const user = activeUsers.find((user) => user.userId == youID);
    if (user) {
      io.to(user.socketId).emit("get_message", data);
      io.to(user.socketId).emit("recibir", { newMessage: myID });
      // console.log("Đã gửi :", user);
    }
  });
  // notification

  socket.on("add_notification", (data) => {
    const { userid, myID } = data;
    const user = activeUsers.find((user) => user.userId == userid);
    if (user) {
      // console.log("Chính nó");
      io.to(user.socketId).emit("notification", { newNoti: myID });
    }
  });

  // ------------------------

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get_user", activeUsers);
    socket.broadcast.emit("callEnded");
  });

  // call
  socket.on("findUserCall", (userCallId) => {
    const { myID, youID } = userCallId;
    const userOk = activeUsers.find((user) => user.userId === myID);
    const conlai = activeUsers.find((user) => user.userId === youID);
    if (userOk && conlai) {
      io.emit("isyou", activeUsers);
      io.to(conlai.socketId).emit("callID", { idcall: userOk.socketId });
      io.to(conlai.socketId).emit("calling", userOk);
    }
  });
  socket.on("calluser", (data) => {
    io.to(data.userToCall).emit("calluser", {
      signal: data.signalData,
      from: data.from,
    });
  });
  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
  socket.on("endcall", (userCallId) => {
    const userOk = activeUsers.find((user) => user.userId === userCallId);
    if (userOk) {
      socket.broadcast.emit("end", "callend");
    }
  });
  // typing
  socket.on("typingadd", (data) => {
    const { youID } = data;
    const user = activeUsers.find((user) => user.userId == youID);
    if (user) {
      io.to(user.socketId).emit("typingok", data);
    }
  });
  socket.on("typingstop", (data) => {
    const { youID } = data;
    const user = activeUsers.find((user) => user.userId == youID);
    if (user) {
      io.to(user.socketId).emit("typingstop", data);
    }
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

app.use("/notification", notification);

app.use("/call", callEnd);

server.listen(port, () => {
  console.log(`Sever app listening on port ${port}`);
});
