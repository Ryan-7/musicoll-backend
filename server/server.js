const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer  = require('multer');
const multerS3 = require('multer-s3');

const mongoose = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Project} = require('./models/project');
const {User} = require('./models/user');

const _ = require('lodash');

// AWS SDK
const aws = require('aws-sdk');
const awsconfig = require('../s3_config.json');
aws.config.update(awsconfig);
const s3 = new aws.S3()

const port = process.env.port || 3000; // Stores all environment variables in key value pairs, we want port



// Server
const app =  express();
app.listen(port, () => {
    console.log('App started on Port ' + port);
});

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Middleware for parsing incoming body for JSON. 
 app.use(bodyParser.json());


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
// No need to return all project data,'pick' is a very useful method here.

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


// TODO: Limit file size and file type on S3. 
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'musicollapp',
        acl: 'public-read-write',
        key: function (req, file, cb) {
            let randomFileName = Math.random().toString(36).substring(7);
            cb(null, randomFileName + '.ogg'); 
        }
    })
});

  
// Add audio to project 
// MulterS3 middleware

app.post('/api/projects/audio/:id', upload.single('audio'), (req, res) => {
    let id = req.params.id;

    // req.body gives us access to the JSON string on the FormData. 
    let trackInfo = JSON.parse(req.body.body);

    let audio = {
        file: req.file.location,
        title: trackInfo.trackName,
        description: trackInfo.trackDescription,
        key: req.file.key,
        date: new Date()
    }

    Project.findOneAndUpdate({_id: id}, {$push: {audio: audio}}, {new: true})
    .then((updatedProject) => {
        res.send(updatedProject);
    }) 
    
});


// Delete audio file from project DB & S3
app.patch('/api/projects/audio/:id', (req, res) => {
    let id = req.params.id; 
    let audioId = req.body.audioId;
    let audioKey = req.body.audioKey;
    console.log(audioKey)

    // Delete from S3
    // Then Delete from DB 

    let deleteParams = {
        Bucket: 'musicollapp',
        Delete: {
            Objects: [
                {
                    Key: audioKey
                }
            ]
        }
    }   

    s3.deleteObjects(deleteParams, (error, response) => {
        if(error) {
            console.log(error);
        } else {
            console.log(response)
            console.log('delete successful');
            Project.findOneAndUpdate({_id: id}, {$pull: {audio: { _id: audioId}}}, {new: true}).then((updatedProject) => {
                res.send(updatedProject);
            }).catch((err) => {
                console.log(err);
            })
        }
    })
})

// Sign-up 

app.post('/api/users/register', (req, res) => {
   // let body = _.pick(req.body, ['email', 'password']) // Get only the properties we want. 

    let user = new User({email: 'ryanb.wisc@gmail6.com', password: 'test'}); 

    // Save the user first so we can access it's _id for creation of token. 

    user.save().then(() => {
        return user.generateAuthToken(() => {

        }).then((token) => {
            res.send(token); // Send the token after successful sign up, so use can auth right away. 
        })
    }).catch((err) => {
        res.status(400).send(err);
    })

})



// Seed Data

const seeds = [
    {
        _id: new ObjectID(),
        name: "Sample Project",
        lyrics: '\nLorem ipsum dolor sit ame\nconsectetur adipiscing elit\nsed do eiusmod tempor incididunt\ndtlabore et dolore magna aliqua\nUt enim ad minim veniam, quis nostrud\nexercitation ullamco laboris nisi ut',
        notes: '\nThis song is written in the key of C#',
        audio: [
            {
                file: "https://s3.us-east-2.amazonaws.com/musicollapp/sample.ogg",
                title: 'Catchy Acoustic Guitar Rhythm',
                description: 'A song I came up with while making this app...Key of A major.',
                date: new Date(),
                key: "sample.ogg"
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
                date: new Date(),
                key: "sample.ogg"
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
                date: new Date(),
                key: "sample.ogg"
            }
        ]
    }
]

// Seed the DB with mock data.

Project.remove({}).then(() => {
    return Project.insertMany(seeds);
}).then(() => {
});


