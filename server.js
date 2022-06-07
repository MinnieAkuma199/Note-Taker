const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs"); //do i need fs here?

const app = express();
const PORT = 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//read-- creating the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//get notes
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html")); //do i need this here?
  res.status(200).json(notes);
});

//listen
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
