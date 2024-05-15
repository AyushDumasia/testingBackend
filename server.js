const express = require("express");
const app = express();
const contactRoutes = require("./routes/contactRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const User = require("./models/userModel.js");
const port = 3000;

app.use(express.json());
app.use(errorHandler);
app.use(express.urlencoded({ urlencoded: true }));

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
};
app.use(session(sessionOption));

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.use((req, res, next) => {
  if (req.path !== "/favicon.ico") {
    console.log(req.method, req.path);
  }
  next();
});

app.get("/", (req, res) => {
  return res.json("Working");
});

app.use("/contact", contactRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log("Server is running on 3000 port");
});

const MONGO_URL = "mongodb://127.0.0.1:27017/contact-project";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("success");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("working");
});
