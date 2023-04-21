require('dotenv').config();
const { error } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const port = process.env.port || 4747;

const db_url =
  'mongodb+srv://shubhamkkc:shubham123@cluster0.pajxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//middleWare

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// establishment DB

mongoose.connect(db_url);

const db = mongoose.connection;

db.once('open', () => console.log('db connect '));

//create schema

let keeperSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { collection: 'keeper' }
);
//create models

let keeperModel = db.model('keeperModel', keeperSchema);

// Route to Get all People
app.get('/api/keeper', (req, res) => {
  keeperModel.find({}, { __v: 0 }, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.status(400).json({ error: err });
    }
  });
});

app.post('/api/keeper/add', (req, res) => {
  let keeper = new keeperModel(req.body);
  keeper.save((err, result) => {
    if (!err) {
      delete result._doc._v;
      res.json(result._doc);
    } else {
      res.status(400).json({ error: err });
    }
  });
});

app.post('/api/keeper/delete/', async (req, res) => {
  try {
    const id = req.body.id;
    const d = await keeperModel.findByIdAndDelete({ _id: id.toString() });
    res.json({ message: 'deleted' });
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log('server is started');
});
