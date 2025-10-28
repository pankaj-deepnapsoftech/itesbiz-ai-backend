const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-here-make-it-very-long-and-secure-123456789";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
  };
const generateRefferalToken = (obj)=>{
  return jwt.sign(obj, JWT_SECRET, { expiresIn: "1d" });
}
const decryptToken = (token)=>{
  return jwt.verify(token, JWT_SECRET);
}
  
module.exports = { generateToken, generateRefreshToken, generateRefferalToken,decryptToken };
