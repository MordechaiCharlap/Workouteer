const admin = require("firebase-admin");

const db = admin.firestore();
const bucket = admin.storage().bucket();

const verifyAccessToken = (req, res, next) => {
  try {
    // Get the access token from the request headers
    const accessToken = req.headers.authorization;

    // Check if the access token exists
    if (!accessToken) {
      return res.status(401).json({ error: "Access token missing" });
    }

    // Perform token verification logic here
    // ...

    // If token verification succeeds, proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { db, bucket, verifyAccessToken };
