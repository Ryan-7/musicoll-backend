const {User} = require('./../models/user');


// This is middleware, it will modify our request object by adding the user we retrieve from the database.
// Using that information, it will make it easy to find that user's specific database info. 

let authenticate = (req, res, next) => {
    let token = req.header('musicoll-auth'); // get token from request header. 
    console.log("Token:")
    console.log(token)
    User.findByToken(token).then((user) => {
        if (!user) { 

           return Promise.reject('Cannot Authenticate!')
        }
    
        req.user = user; // make a proprety on the request object for the user from DB.
        req.token = token;  // make a property on the request object for the received token. 
        next() // since this is middleware, we need to call next to keep the code moving

    }).catch((err) => {
        res.status(401).send('Unauthorized'); // Can put a custom error response here 
                                // Don't want to call next because why would we want the get request to run after an error?
    })
    
};

module.exports = {
    authenticate: authenticate
}