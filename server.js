// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// routing

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

app.get("/notes",function(req,res){
    res.sendFile(path.join(__dirname, "public/notes.html"))
})

  
app.get("/api/notes",function(req,res){
  res.sendFile(path.join(__dirname, "./db/db.json"));
})


// delete
app.delete("/api/delete/notes",function(req,res){
  var index = parseInt(req.body.index);
  console.log(index);
  fs.readFile("./db/db.json", 'utf8', (err, fileData) => {
    if (err) {
      return (err)
    }
    var final = [];
    var object = JSON.parse(fileData)
    console.log(object)
    for(var i = 0; i<object.length; i ++){
      if(object[i].id !== index){
        final.push(object[i]);
      }
    }
    fs.writeFile("./db/db.json",JSON.stringify(final),(err) => {
      if (err) throw err;
    })
  })
  res.send("object removed");
})  
// Post 

app.post("/api/notes", function(req, res) {
  var newNote = req.body;
  console.log(newNote);
  console.log("HELLO?")
  
  
  fs.readFile("./db/db.json", 'utf8', (err, fileData) => {
    if (err) {
      return (err)
    }
    const object = JSON.parse(fileData)
    console.log(object)
    newNote.id = object.length;
    const notes = [...object,newNote];
    console.log(notes);
    
    fs.writeFile("./db/db.json",JSON.stringify(notes),(err) => {
      if (err) throw err;
    })
  })
  res.send("added object")
})

app.use(express.static('public'));
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});