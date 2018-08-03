const express=require("express");
const app=express();
const path=require("path");
const http = require("http");
const fs = require("fs");
const PORT=process.env.PORT||80;

app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res){
  res.render("procvolit.ejs", {});
});

app.listen(PORT);
console.log("Process ID "+process.pid+" is now listening on port number "+PORT+".");
