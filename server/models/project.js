const mongoose = require('mongoose');

const Project = mongoose.model('Project',  {

    name: {
        type: String,
        trim: true,
        default: 'Untitled Project'
    },
    lyrics: {
        type: String,
        default: '\nA spot to write lyrics\nStore ideas and whatnot\nDo not go down that road'
    },
    notes: {
        type: String,
        default: 'Notes, ideas, inspirations'
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