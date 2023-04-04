const jwt = require('jsonwebtoken');
const db = require('./Database');

//to generate the token; 
const generateToken = (username, password, callback) => {
    // create a new JWT token with user data and secret key
    const query = "SELECT user_id, role FROM user WHERE username = ? AND PASSWORD = ?";
    db.query(query, [username, password], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        if (result.length === 0) {
            return callback("User not found", {});
        }
        const [{ user_id: userID, user_role: role }] = result;
        const token = jwt.sign(
            { userID, role },
            process.env.SECRET_KEY
        );
        return callback(null, { userID, role, token });
    })
};




module.exports = { generateToken };