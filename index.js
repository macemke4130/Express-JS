const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
let app = express();

const css = '<head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"><link rel="stylesheet" href="./css/styles.css"><title>the Void</title></head>';
const success = "<p>your message to the Void has been logged in void.json</p>";
const allBtn = '<a href="/formsubmissions" class="btn btn-warning m-1">view all messages</a>';
const homeBtn = '<a href="/" class="btn btn-warning m-1">send another message</a>';
const dataPath = path.join(__dirname, "/void.json");

app.use(bodyParser.urlencoded({ extended: false }));

console.log("Hello from the Web Server side...");

// Console Logs the URL requests --
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.post("/form-submit", (req, res, next) => {
  let name = req.body.name;
  let msg = req.body.msg;
  let inject = { name: name, msg: msg };

  fs.readFile(dataPath, (err, data) => {
    if (err) console.log("err: " + err);

    // This method would not work if the void.json was empty.
    // It would error while trying to stringify the data variable.
    // I worked around this by filling in the first
    // entry by hand. I know this is a hack. Any advice? I couldn't
    // seem to wrap my mind around a conditional for it --

    let newVoidMsg = JSON.parse(data);
    newVoidMsg = [...newVoidMsg, inject];
    let myInput = JSON.stringify(newVoidMsg);

    fs.writeFile(dataPath, myInput, (err) => {
      if (err) console.log(err);
    });
  });

  res.status(200).send(`${css}<h2><strong>${name}</strong> wishes to send a message to the Void</h2><p>${msg}</p>${success}${homeBtn}${allBtn}`);
  next();
});

app.get("/formsubmissions", (req, res) => {
  fs.readFile(dataPath, (err, data) => {
    if (err) console.log("err: " + err);

    let newJSON = JSON.parse(data);

    // Please tell me why there is a comma ( , ) in between each print out --
    res.status(200).send(css + "<body>" + newJSON.map((v) => `<h2>${v.name}</h2><p>${v.msg}</p>`) + homeBtn + "</body>");
  });
});
app.use(express.static(path.join(__dirname, "./public/")));

app.listen(3000);
