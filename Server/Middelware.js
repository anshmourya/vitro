require('dotenv').config();
const db = require('./Database');
const jwt = require('jsonwebtoken');
//aunth the sigin and create the token;
const auth = (req, res, next) => {
    // check if the user is logged in (has a valid token)
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ err: 'Unauthorized' });
        return;
    }

    // verify and decode the token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();

    } catch (err) {
        res.status(401).json({ err: 'Unauthorized' });
    }

}
//CHECK THE ROLE OF THE USER.
const Role = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (role === userRole) {
            next();
        } else {
            res.status(403).send({ err: 'Access denied' });
        }
    };
}
module.exports = { auth, Role };