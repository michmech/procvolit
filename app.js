const express=require("express");
const app=express();
const path=require("path");
const fs=require("fs");
const md=require("markdown-it")({html: true});
const attrs=require("markdown-it-attrs"); md.use(attrs);
const PORT=process.env.PORT||80;

app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res){
  res.render("procvolit.ejs", {});
});

app.get("/:slug(info)", function(req, res){
  fs.readFile(`./info/${req.params.slug}.md`, "utf8", function(err, raw){
    var body=doMarkdown(raw)+"\n";
    res.render("info.ejs", {
      slug: req.params.slug,
      body: body,
    });
  });
});
function doMarkdown(str){
  str=md.render(str);
  str=str.replace(/\<a href="http/g, `<a target="_blank" href="http`);
  return str;
}

app.listen(PORT);
console.log("Process ID "+process.pid+" is now listening on port number "+PORT+".");
