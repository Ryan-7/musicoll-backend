const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Project} = require('./models/project');


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
app.get('/api/projects/new', (req, res) => {
        let newProject = new Project({
        });
    
        newProject.save();
    
        res.status(200).send(newProject._id);
    
    })

// click new project
// get back this id
// then route to that id
// and the app will function as normal, using the param to fetch the data 
    


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


