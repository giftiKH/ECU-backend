const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from the authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Extract the token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user data to the request object
        req.user = decoded; // Assuming the payload contains user information
        next(); // Call the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = authMiddleware;
