const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
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
        name: "Test!"
    });

    newProject.save(); // Save the object to Database 

    res.status(200).send('Route Worked')

})

