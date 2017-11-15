// Require mongoose and connect to the MongoDB database.
// Mongoose is basically used to model data, an intermediate between mongodb and Node.js
// Speeds up writing queries and data validation. 
// Certainly could use Mongodb without it. 
/*
If we wanted to connect to MongoDB w/o Mongoose, we would need the driver called 'MongoClient'
Example: MongoClient.connect('mongodb://localhost:27017/TodoApp')
*/

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/musicoll'); // Where MongoDB is connected

mongoose.Promise = require('bluebird');

module.exports = {
    mongoose: mongoose
}