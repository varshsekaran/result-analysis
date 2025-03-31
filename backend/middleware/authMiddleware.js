const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");

    console.log("Auth Header received:", authHeader);  // 🔍 Debugging

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1]; // Extract token correctly

    console.log("Extracted Token:", token);  // 🔍 Debugging

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const secretKey = process.env.JWT_SECRET || "7e67ff4d75c420c0086fb98f22e53fd080472cdf4ef5812a7bb8587a26b030aa";
        const decoded = jwt.verify(token, secretKey);

        console.log("Decoded Token:", decoded);  // 🔍 Debugging

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error);  // 🔍 Debugging
        res.status(401).json({ message: "Token verification failed" });
    }
};

