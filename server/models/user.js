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

// Hash the password before saving to Database 
// Middleware that is called before the user gets saved to the database 

UserSchema.pre('save', function(next) { // Want 'this' to point to user instance, avoid using fat arrow function. 
   
    if (this.isModified('password')) { // Built in method that only hashes a password if its been modified, avoid hashing a hash.
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next(); // Now the password will be hashed upon saving to DB.
            })
        })
    } else {
        next();
    }
})


// Tack on our own method to the UserSchema for generating Auth Tokens.
// This method will exist on any new user object we create. 

UserSchema.methods.generateAuthToken = function() { 

    // Let access define what the purpose of this token is. 
    let access = 'auth';
 
  //  let token = jwt.sign({_id: this._id, access: access}, theSalt.theSalt, {expiresIn: 60}).toString();
    let token = jwt.sign({_id: this._id, access: access}, theSalt.theSalt).toString();

    // 'this' refers to the user document we created 
    // Clear old tokens 
    this.tokens = [];
    // Push token to this user's token array 
    this.tokens.push({token: token, access: access});

    return this.save().then(() => {
        return token; 
    });
};

// statics refer to Model methods for the User collection, not user instance. 
// Decode the token so we can query the database for the associated user. 

UserSchema.statics.findByToken = function(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, theSalt.theSalt);
    } catch(e) {
        return Promise.reject('Authentication Failed');
    }

    // 'this' is pointing to the users collection in the database.
    // Return the user with the associated id from the token. 
    return this.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}


// Login with username and password
// Method exists on the collection
// Wrap bycrpt in promise since it uses callbacks
// If the user is found by email, use bcrypt to compare their password to the hashed password in Database
// If password matches, return user object which we can use to generate and send back new auth token.

UserSchema.statics.findByCredentials = function(email, password) {
    return this.findOne({
        email: email
    }).then((user) => {
        if (!user) {
            console.log('user not found')
            return Promise.reject('User Not Found!');
        } else {

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        resolve(user)
                    } else {
                        reject();
                    }
                })
            })
        }
    })
}


let User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
}