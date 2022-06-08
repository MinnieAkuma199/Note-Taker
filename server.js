const express = require("express");
const path = require("path");
const fs = require("fs"); //need fs to readfile db.json
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//linking to notes.html and displaying
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//connecting /notes to db.json
//can not have 2 get routes with the very same path so that why we use /api
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      res.status(200).json(parsedData);
    }
  });
});
// app.get("/notes/id:", (req, res) => { dont know if i need a get request or not

//need post so when user puts in note it goes to notes (db.json)
app.post("/api/notes", (req, res) => {
  console.log(req.body); //this helps find that title and text are keys already passed in from front end(index.js)
  const { title, text } = req.body;
  if (title && text) {
    req.body.id = uuidv4();
    readAndAppend(req.body, "./db/db.json");

    res.status(200).json(req.body);
  } else {
    res.status(400).send("Error in user request");
  }
});

//Delete request
// Creating a DELETE request
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  console.log("This is being deleted", id);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let currentNote = JSON.parse(data);
      let deleteNote = currentNote.filter((note) => note.id != id);
      writeToFile("./db/db.json", deleteNote);
      res.status(200).json(deleteNote);
    }
  });
});

// Write the string to a file
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

const writeToFile = (destination, content) => {
  console.log(content, destination);
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
};
//linking to the index.html anything that is put into url after / that isnt notes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//listen
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
