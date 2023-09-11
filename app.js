//app.js

const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost/node-repeat");
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("open", () => console.log("db connected!"));

app.use(express.json());
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);

app.listen(3000, () => {
  console.log("server start!!!");
});
