const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
   // res.send("welcome");
   res.render("index");
});

app.listen(3000, function (){
    console.log("Server is running on port 3000");// it is running on http://localhost:3000

});