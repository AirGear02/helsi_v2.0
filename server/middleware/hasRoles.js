const jwt = require('jsonwebtoken');

module.exports = (roles) => (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token === undefined) return res.status(400).json({message: 'Please log in'});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(400).json({message: "Invalid auth token"});
        
        if(!roles.includes(user.role)) return res.status(403).json({message: 'You don\'t have premissions'});
        req.body.user = user;
        next();
    })
}