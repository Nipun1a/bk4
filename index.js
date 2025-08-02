const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Internal Server Error");
        }

        const tasks = [];

        // Read content of each file
        let pending = files.length;
        if (!pending) return res.render("index", { tasks });

        files.forEach(file => {
            fs.readFile(`./files/${file}`, "utf-8", (err, content) => {
                if (err) {
                    console.error("Error reading file:", err);
                    return res.status(500).send("Internal Server Error");
                }

                tasks.push({
                    title: file.replace(".txt", "").replace(/_/g, " "),
                    message: content
                });

                if (!--pending) {
                    res.render("index", { tasks });
                }
            });
        });
    });
});


app.post("/create", function (req, res){
    fs.writeFile(`./files/${req.body.title.split(" ").join("_")}.txt`, req.body.message, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect("/");
    });
});

app.get("/files/:filename", function (req, res){
    const filename = req.params.filename;
    fs.readFile(`./files/${filename}`, "utf-8", function (err, content) {
        if (err) {
            return res.status(404).send("Task not found");
        }
        res.render("show", {
            task: {
                title: filename.replace(".txt", "").replace(/_/g, " "),
                message: content
            }
        });
    });
});

app.get("/delete/:filename", function (req, res){
    const filename = req.params.filename;
    fs.unlink(`./files/${filename}.txt`, function (err) {
        if (err) {
            return res.status(404).send("Task not found");
        }
        res.redirect("/");
    });
});

app.post("edit/:filename", function (req, res){
    const filename = req.params.filename;
    fs.writeFile(`./files/${filename}.txt`, req.body.message, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect("/");
    });
});


app.listen(3000, function (){
    console.log("Server is running on port 3000");// it is running on http://localhost:3000

});