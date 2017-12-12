const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const theSalt = require('../../theSalt'); 

// Define our Schema outside of the model so we can tack on our own methods 

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


// Tack on our own method to the UserSchema for generating Auth Tokens.
// This method will exist on any new user object we create. 

UserSchema.methods.generateAuthToken = function() { 

    // Let access define what the purpose of this token is. 
    let access = 'auth';
 
    let token = jwt.sign({_id: this._id, access: access}, theSalt.theSalt).toString();

    // 'this' refers to the user document we created 
    // Clear old tokens 
    this.tokens = [];
    // Push token to this user's token array 
    this.tokens.push({token: token, access: access});

    return this.save().then(() => {
        return token; 
    })

}


let User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
}