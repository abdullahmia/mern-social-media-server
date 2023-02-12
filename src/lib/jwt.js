const jwt = require("jsonwebtoken");

module.exports.genarateToken = async (payload, expired) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expired,
    });
};

module.exports.verifyToken = async (token) => {
    if (token) {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.email) {
                return true;
            }
        } catch (error) {
            return false;
        }
    }
};
