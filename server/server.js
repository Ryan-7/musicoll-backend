const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Project} = require('./models/project');
const _ = require('lodash');


// Server
const app =  express();
app.listen(3000, () => {
    console.log('App started on Port 3000')
});

// Middleware for parsing incoming body for JSON. 
app.use(bodyParser.json());

// Allow cross origin request for local dev.
app.options('*', cors());


// Hit this route, we get a request object with a body that we can use stuff with. 

app.post('/api/projects', (req, res) => {
    // Create new object based on Project model. 
    let newProject = new Project({
    });
    newProject.save(); // Save the object to Database 
    res.status(200).send('Route Worked')
})

// New Project 
// Creates empty Project object with an Id we can use to route to on the client side and modify from there.
app.get('/api/projects/new', (req, res) => {
        let newProject = new Project({
        });
        newProject.save();  
        res.status(200).send(newProject._id);
})

// Return the names and Id of each project so we can link on the client side.
// No need to return all project data, since that would be a huge payload, 'pick' is a very useful method here.
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

    


// Seed Data

const seeds = [
    {
        _id: new ObjectID(),
        name: "Awesome Project",
        lyrics: '\nLorem ipsum dolor sit ame\nconsectetur adipiscing elit\nsed do eiusmod tempor incididunt\ndtlabore et dolore magna aliqua\nUt enim ad minim veniam, quis nostrud\nexercitation ullamco laboris nisi ut',
        notes: 'This song is written in the key of C#',
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
        notes: 'This song is written in the key of C#',
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
        notes: 'This song is written in the key of C#',
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


