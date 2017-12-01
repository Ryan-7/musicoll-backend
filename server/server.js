const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Project} = require('./models/project');
const _ = require('lodash');

const port = process.env.port || 3000; // Stores all environment variables in key value pairs, we want port

// Server
const app =  express();
app.listen(port, () => {
    console.log('App started on Port ' + port)
});

// Middleware for parsing incoming body for JSON. 
app.use(bodyParser.json());

// Allow cross origin request for local dev.
app.options('*', cors());


//Test

app.get('/', (req, res) => {
    res.status(200).send("Hello");
})



// New Project 
// Creates empty Project object with an Id we can use to route to on the client side and modify from the app.
app.get('/api/projects/new', (req, res) => {
    let newProject = new Project({
    });
    newProject.save();  
    res.status(200).send(newProject._id);
})

// Return the names and Id of each project so we can link on the client side.
// No need to return all project data, since that would be a huge payload, 'pick' is a very useful method here.
// This won't be necessary if I just serve links to the wav files to the front end.
app.get('/api/projects/list', (req, res) => {
    Project.find({}).then((results) => {
        newArray = [];
        _.forEach(results, (item) => {
            newArray.push(
                _.pick(item, ['_id', 'name'])
            )
        })
        res.status(200).send(newArray);
    })
})

// Get project by Id
app.get('/api/projects/:id', (req, res) => {
    let id = req.params.id;
    Project.findOne({_id: id}).then((result) => {
        res.status(200).send(result);
    })
})
    

// Delete Project by Id
app.delete('/api/projects/:id', (req, res) => {
    let id = req.params.id;
    Project.findOneAndRemove({_id: id}).then((result) => {
        res.send(result);
    })
})

// Edit Items 


app.patch('/api/projects/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'lyrics', 'notes']);
    Project.findOneAndUpdate({ _id: id}, {$set: {name: body.name, lyrics: body.lyrics, notes: body.notes}}, {new: true})
    .then((doc) => {
        res.status(200).send(doc);
    })
})


// Seed Data

const seeds = [
    {
        _id: new ObjectID(),
        name: "Awesome Project",
        lyrics: '\nLorem ipsum dolor sit ame\nconsectetur adipiscing elit\nsed do eiusmod tempor incididunt\ndtlabore et dolore magna aliqua\nUt enim ad minim veniam, quis nostrud\nexercitation ullamco laboris nisi ut',
        notes: '\nThis song is written in the key of C#',
        audio: [
            {
                file: "musicFile.wav",
                title: 'Guitar Rhythm',
                description: 'Backing rhythm without lead or melody.',
                date: new Date()
            }
        ]
    },
    {
        _id: new ObjectID(),
        name: "Project of the Century",
        lyrics: '\nLorem ipsum dolor sit ame\nconsectetur adipiscing elit\nsed do eiusmod tempor incididunt\ndtlabore et dolore magna aliqua\nUt enim ad minim veniam, quis nostrud\nexercitation ullamco laboris nisi ut',
        notes: '\nThis song is written in the key of C#',
        audio: [
            {
                file: "musicFile.wav",
                title: 'Guitar Rhythm',
                description: 'Backing rhythm without lead or melody.',
                date: new Date()
            }
        ]
    },
    {
        _id: new ObjectID(),
        name: "Great Idea for Us",
        lyrics: '\nLorem ipsum dolor sit ame\nconsectetur adipiscing elit\nsed do eiusmod tempor incididunt\ndtlabore et dolore magna aliqua\nUt enim ad minim veniam, quis nostrud\nexercitation ullamco laboris nisi ut',
        notes: '\nThis song is written in the key of C#',
        audio: [
            {
                file: "musicFile.wav",
                title: 'Guitar Rhythm',
                description: 'Backing rhythm without lead or melody.',
                date: new Date()
            }
        ]
    }
]

// Seed the DB with mock data.

Project.remove({}).then(() => {
    return Project.insertMany(seeds);
}).then(() => {
});


