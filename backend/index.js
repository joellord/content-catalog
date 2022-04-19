const express = require("express");
const mongodb = require('mongodb');
const cors = require("cors");

require("dotenv").config()

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

let dbConnected = false;

const getMongoDB = async () => {
  const MongoClient = mongodb.MongoClient;
  let logConnString = MONGODB_URI.replace(/\/(.*:.*)@/, "//<user>:<password>@");
  console.log(`Connecting to database using ${logConnString}`);
  let db;
  try {
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = await client.db("grocery");
    dbConnected = true;  
  } catch (e) {
    console.log(e.toString());
  }
  return db;
}
let db;
let itemCollection;
getMongoDB().then(async _db => {
  db = _db;
  itemCollection = await db.collection("clean_items");
});

let app = express();
app.use(cors())

const log = (route, message) => {
   const now = new Date();
   const date = `${now.getDay()}/${(now.getMonth()+1).toString().padStart(2, "0")}/${now.getFullYear()}`;
   const time = `${(now.getHours()).toString().padStart(2, "0")}:${(now.getMinutes()).toString().padStart(2, "0")}:${(now.getSeconds()).toString().padStart(2, "0")}`;
   const log = `[${date} ${time}] - (${route}) - ${message}`;
   console.log(log);
}

app.get("/health", (req, res) => {
  log("/health", "GET request");
  res.send({ status: "Ok", dbConnected }).status(200);
});

// This route serves items filtered by a specific search term
// TODO: Update this to use Atlas Search
app.get("/search/:query", async (req, res) => {
  log("/search", `GET request with param ${req.params.query}`);
  let results = [];
  try {
    // results = await itemCollection.find({name: req.params.query}).toArray();
    results = await itemCollection.aggregate([
      { $search: {
          index: 'default',
          text: {
            query: req.params.query,
            path: ["name", "brand", "category", "tags"]
          }
        }
      }
    ]).toArray();

  }
  catch(e) {
    log("/search", e.toString());
  }
  res.send(results).status(200);
});

app.get("/autocomplete/:query", async (req, res) => {
  log("/autocomplete", `GET request with param ${req.params.query}`);
  log("/search", `GET request with param ${req.params.query}`);
  let results = [];
  try {
    // results = await itemCollection.find({name: req.params.query}).toArray();
    results = await itemCollection.aggregate([
      {
        '$search': {
          'index': 'autocomplete', 
          'autocomplete': {
            'query': req.params.query, 
            'path': 'name'
          }, 
          'highlight': {
            'path': [
              'name'
            ]
          }
        }
      }, {
        '$project': {
          'name': 1, 
          'highlights': {
            '$meta': 'searchHighlights'
          }
        }
      }, {
        '$limit': 5
      }
    ]).toArray();

  }
  catch(e) {
    log("/search", e.toString());
  }
  res.send(results).status(200);
});

app.get("/categories", async (req, res) => {
  let results = {};
  log("/categories", `GET request`);

  try {
    results = await itemCollection.aggregate([
      {$facet: {
        categories: [ 
          { $match: {category: {$ne: null} }},
          { $sortByCount: "$category" } 
        ]
      }}
    ]).toArray();
  } catch(e) {
    log("/categories", e.toString());
  }
  res.send(results).status(200);
});

app.get("/items/category/:category", async (req, res) => {
  log("/items/category/:category", `GET request with parameter ${req.params.category}`);
  let results = [];
  try {
    results = await itemCollection.find({category: req.params.category}).limit(24).toArray();
  } catch(e) {
    log(`/items/category/${req.params.category}`, e.toString());
  }
  res.send(results).status(200);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));