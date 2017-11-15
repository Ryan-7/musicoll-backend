const mongoose = require('mongoose');

const Project = mongoose.model('Project',  {

    name: {
        type: String,
        trim: true
    },
    lyrics: {
        type: String
    },
    notes: {
        type: String
    },
    audio: [{
        file: String,
        title: String,
        description: String,
        date: Date
    }],
    _creator: {

    }
});

module.exports = {
    Project: Project
}